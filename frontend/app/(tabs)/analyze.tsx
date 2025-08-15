import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "@tensorflow/tfjs-react-native";
import * as tf from "@tensorflow/tfjs-core";
import * as posedetection from "@tensorflow-models/pose-detection";
import * as ImagePicker from "expo-image-picker";
import * as VideoThumbnails from "expo-video-thumbnails";
import { Video, ResizeMode } from "expo-av";
import { decodeJpeg } from "@tensorflow/tfjs-react-native";
import { Svg, Circle, Line } from "react-native-svg";

const { width: screenWidth } = Dimensions.get("window");

export default function AnalyzeScreen() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [backend, setBackend] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [detectorStatus, setDetectorStatus] =
    useState<string>("Not initialized");
  const [estimateStatus, setEstimateStatus] = useState<string>("-");
  const [selectedVideoUri, setSelectedVideoUri] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [posesResult, setPosesResult] = useState<Array<{
    timeMs: number;
    poses: posedetection.Pose[];
    uri?: string;
    width?: number;
    height?: number;
  }> | null>(null);
  const [detector, setDetector] = useState<posedetection.PoseDetector | null>(
    null
  );
  const videoRef = useRef<Video>(null);
  const [frameTotal, setFrameTotal] = useState<number>(0);
  const [frameIndex, setFrameIndex] = useState<number>(0);
  const [showRawJson, setShowRawJson] = useState<boolean>(false);
  const [playbackPosMs, setPlaybackPosMs] = useState<number>(0);
  const [overlayEnabled, setOverlayEnabled] = useState<boolean>(false);
  const [videoOverlaySize, setVideoOverlaySize] = useState<{
    w: number;
    h: number;
  } | null>(null);
  const [thumbOverlaySize, setThumbOverlaySize] = useState<{
    w: number;
    h: number;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Color scheme by body side
  const getKeypointSide = (name?: string) => {
    if (!name) return "center" as const;
    if (name.startsWith("left_")) return "left" as const;
    if (name.startsWith("right_")) return "right" as const;
    return "center" as const;
  };
  const colorForSide = (side: "left" | "right" | "center") =>
    side === "left" ? "#22c55e" : side === "right" ? "#ef4444" : "#eab308";

  const initTensorFlow = async () => {
    setIsInitializing(true);
    setError(null);
    setTestResult(null);
    try {
      // Try rn-webgl first (best perf on device), fall back to cpu if unavailable
      const ok = await tf.setBackend("rn-webgl");
      if (!ok) {
        await tf.setBackend("cpu");
      }

      // Ensure TF is ready (after backend selection)
      await tf.ready();

      const activeBackend = tf.getBackend();
      setBackend(activeBackend);

      // Run a tiny test computation
      const sum = tf.tidy(() => tf.sum(tf.tensor1d([1, 2, 3, 4])));
      const value = (await sum.data())[0];
      setTestResult(`sum([1,2,3,4]) = ${value}`);

      // Load MoveNet detector
      setDetectorStatus("Loading MoveNet...");
      const detector = await posedetection.createDetector(
        posedetection.SupportedModels.MoveNet,
        {
          modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
          enableSmoothing: true,
        }
      );
      setDetectorStatus("MoveNet ready");
      setDetector(detector);

      // Run a simple estimate on a dummy tensor to verify the pipeline works
      setEstimateStatus("Running estimate on dummy tensor...");
      const input = tf.zeros([192, 192, 3], "float32") as tf.Tensor3D;
      try {
        const poses = await detector.estimatePoses(input, {
          flipHorizontal: false,
        });
        setEstimateStatus(`estimatePoses ok: ${poses.length} pose(s)`);
      } finally {
        tf.dispose(input);
      }
    } catch (e: any) {
      setError(String(e?.message || e));
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    initTensorFlow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedVideoUri(result.assets[0].uri);
        setPosesResult(null);
      }
    } catch (e: any) {
      setError(`Video pick failed: ${String(e?.message || e)}`);
    }
  };

  const analyzeSelectedVideo = async () => {
    if (!selectedVideoUri) {
      setError("No video selected");
      return;
    }
    if (!detector) {
      setError("MoveNet detector not ready");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setEstimateStatus("Estimating poses from video frames...");

    try {
      // Try to get duration from the Video ref; fall back to 5s if unavailable
      let durationMs: number | null = null;
      try {
        const status = await videoRef.current?.getStatusAsync();
        if (status && "durationMillis" in status && status.durationMillis) {
          durationMs = status.durationMillis;
        }
      } catch {}

      // Build timestamps every 250ms
      const times: number[] = [];
      const stepMs = 250;
      const totalMs = durationMs && durationMs > 0 ? durationMs : 5000;
      const maxFrames = 400; // safety cap
      for (let t = 0; t < totalMs && times.length < maxFrames; t += stepMs) {
        times.push(t);
      }

      const posesAccum: any[] = [];
      setFrameTotal(times.length);
      setFrameIndex(0);
      for (let i = 0; i < times.length; i++) {
        const t = times[i];
        const {
          uri: thumbUri,
          width: thumbWidth,
          height: thumbHeight,
        } = await VideoThumbnails.getThumbnailAsync(selectedVideoUri, {
          time: t,
        });
        const res = await fetch(thumbUri);
        const buf = await res.arrayBuffer();
        const jpeg = new Uint8Array(buf);

        const image = decodeJpeg(jpeg, 3);
        const input = tf.image.resizeBilinear(image, [192, 192]) as tf.Tensor3D;
        const result = await detector.estimatePoses(input, {
          flipHorizontal: false,
        });
        tf.dispose([image, input]);
        posesAccum.push({
          timeMs: t,
          poses: result,
          uri: thumbUri,
          width: thumbWidth,
          height: thumbHeight,
        });

        setFrameIndex(i + 1);
        // Yield to UI thread for progress updates
        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      setPosesResult(posesAccum);
      setEstimateStatus(`Processed ${posesAccum.length} frames`);
    } catch (e: any) {
      setError(`Analyze failed: ${String(e?.message || e)}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <ScrollView className="flex-1">
        <View className="p-6">
          <View className="mb-6">
            <Text className="text-3xl font-bold text-white mb-2">
              TensorFlow Test
            </Text>
            <Text className="text-slate-400">
              Minimal screen to initialize TensorFlow and run a small test.
            </Text>
          </View>

          <View className="bg-slate-800 p-4 rounded-xl mb-4">
            <View className="flex-row items-center mb-2">
              <View
                className={`w-3 h-3 rounded-full mr-3 ${
                  isInitializing
                    ? "bg-yellow-500"
                    : error
                      ? "bg-red-500"
                      : "bg-green-500"
                }`}
              />
              <Text className="text-white font-semibold">
                {isInitializing
                  ? "Initializing TensorFlow..."
                  : error
                    ? "Initialization Failed"
                    : "TensorFlow Ready"}
              </Text>
            </View>

            <View className="space-y-1">
              <Text className="text-slate-300 text-sm">
                Backend: {backend ?? "-"}
              </Text>
              <Text className="text-slate-300 text-sm">
                Test: {testResult ?? "-"}
              </Text>
              <Text className="text-slate-300 text-sm">
                MoveNet: {detectorStatus}
              </Text>
              <Text className="text-slate-300 text-sm">
                Estimate: {estimateStatus}
              </Text>
              {error && <Text className="text-red-400 text-sm">{error}</Text>}
            </View>
          </View>

          <TouchableOpacity
            onPress={initTensorFlow}
            className="bg-blue-600 p-4 rounded-xl items-center"
          >
            {isInitializing ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold">
                Re-run Initialization
              </Text>
            )}
          </TouchableOpacity>

          <View className="h-4" />

          <TouchableOpacity
            onPress={pickVideo}
            className="bg-slate-700 p-4 rounded-xl items-center"
          >
            <Text className="text-white font-semibold">Upload Video</Text>
          </TouchableOpacity>

          {selectedVideoUri && (
            <View className="bg-slate-800 p-4 rounded-xl mt-4">
              <Text className="text-white font-semibold mb-2">
                Selected Video
              </Text>
              <View className="bg-black rounded-lg overflow-hidden">
                <View
                  pointerEvents="box-none"
                  style={{ position: "relative", width: "100%", height: 220 }}
                  onLayout={(e) =>
                    setVideoOverlaySize({
                      w: e.nativeEvent.layout.width,
                      h: e.nativeEvent.layout.height,
                    })
                  }
                >
                  <Video
                    ref={videoRef}
                    source={{ uri: selectedVideoUri }}
                    style={{ width: "100%", height: "100%" }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    shouldPlay={false}
                    onPlaybackStatusUpdate={(status: any) => {
                      if (status?.isLoaded) {
                        setPlaybackPosMs(status.positionMillis ?? 0);
                        setIsPlaying(!!status.isPlaying);
                      }
                    }}
                  />
                  {/* Optional live overlay synced by playback time */}
                  {overlayEnabled && posesResult && videoOverlaySize && (
                    <Svg
                      pointerEvents="none"
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: 220,
                        zIndex: 3,
                      }}
                    >
                      {(() => {
                        // Interpolate between surrounding frames for smoother motion
                        const frames = posesResult
                          .slice()
                          .sort((a, b) => a.timeMs - b.timeMs);
                        if (frames.length === 0) return null;
                        let prev = frames[0];
                        let next = frames[frames.length - 1];
                        for (let i = 0; i < frames.length; i++) {
                          if (frames[i].timeMs <= playbackPosMs)
                            prev = frames[i];
                          if (frames[i].timeMs >= playbackPosMs) {
                            next = frames[i];
                            break;
                          }
                        }
                        const maxGapMs = 1000;
                        const gap = Math.max(1, next.timeMs - prev.timeMs);
                        const t =
                          gap > maxGapMs
                            ? 0
                            : Math.min(
                                1,
                                Math.max(0, (playbackPosMs - prev.timeMs) / gap)
                              );
                        const prevPose = prev.poses?.[0];
                        const nextPose = next.poses?.[0] ?? prevPose;
                        if (!prevPose || !nextPose) return null;
                        const interpKeypoints = prevPose.keypoints.map((kp) => {
                          const nk =
                            nextPose.keypoints.find(
                              (k) => k.name === kp.name
                            ) ?? kp;
                          return {
                            ...kp,
                            x: kp.x + (nk.x - kp.x) * t,
                            y: kp.y + (nk.y - kp.y) * t,
                            score:
                              (kp.score ?? 0) * (1 - t) + (nk.score ?? 0) * t,
                          } as typeof kp;
                        });
                        const p = { ...prevPose, keypoints: interpKeypoints };
                        if (!p || !p.keypoints) return null;
                        const connections: Array<[string, string]> = [
                          ["nose", "left_eye"],
                          ["nose", "right_eye"],
                          ["left_eye", "left_ear"],
                          ["right_eye", "right_ear"],
                          ["left_shoulder", "right_shoulder"],
                          ["left_shoulder", "left_elbow"],
                          ["right_shoulder", "right_elbow"],
                          ["left_elbow", "left_wrist"],
                          ["right_elbow", "right_wrist"],
                          ["left_shoulder", "left_hip"],
                          ["right_shoulder", "right_hip"],
                          ["left_hip", "right_hip"],
                          ["left_hip", "left_knee"],
                          ["right_hip", "right_knee"],
                          ["left_knee", "left_ankle"],
                          ["right_knee", "right_ankle"],
                        ];
                        // Predicted keypoints are in 192x192 model space. Convert back to original frame space, then contain-scale to video view.
                        const modelSize = 192;
                        const origW = prev.width ?? next.width ?? modelSize;
                        const origH = prev.height ?? next.height ?? modelSize;
                        const dstW = videoOverlaySize?.w ?? screenWidth - 64;
                        const dstH = videoOverlaySize?.h ?? 220;
                        const scale = Math.min(dstW / origW, dstH / origH);
                        const drawW = origW * scale;
                        const drawH = origH * scale;
                        const offsetX = (dstW - drawW) / 2;
                        const offsetY = (dstH - drawH) / 2;
                        const mapX = (xModel: number) =>
                          offsetX + xModel * (origW / modelSize) * scale;
                        const mapY = (yModel: number) =>
                          offsetY + yModel * (origH / modelSize) * scale;
                        return (
                          <>
                            {connections.map(([s, e], idx) => {
                              const sk = p.keypoints.find((k) => k.name === s);
                              const ek = p.keypoints.find((k) => k.name === e);
                              if (
                                sk &&
                                ek &&
                                (sk.score ?? 0) > 0.3 &&
                                (ek.score ?? 0) > 0.3
                              ) {
                                const sColor = colorForSide(
                                  getKeypointSide(sk.name)
                                );
                                const eColor = colorForSide(
                                  getKeypointSide(ek.name)
                                );
                                const stroke =
                                  sColor === eColor ? sColor : "#60a5fa";
                                return (
                                  <Line
                                    key={`line_${idx}`}
                                    x1={mapX(sk.x)}
                                    y1={mapY(sk.y)}
                                    x2={mapX(ek.x)}
                                    y2={mapY(ek.y)}
                                    stroke={stroke}
                                    strokeWidth={2}
                                  />
                                );
                              }
                              return null;
                            })}
                            {p.keypoints
                              .filter((kp) => (kp.score ?? 0) > 0.3)
                              .map((kp, i) => (
                                <Circle
                                  key={`kp_${i}`}
                                  cx={mapX(kp.x)}
                                  cy={mapY(kp.y)}
                                  r={3}
                                  fill={colorForSide(getKeypointSide(kp.name))}
                                  stroke="#fff"
                                  strokeWidth={1}
                                />
                              ))}
                          </>
                        );
                      })()}
                    </Svg>
                  )}
                </View>
              </View>

              <View className="h-3" />

              <TouchableOpacity
                onPress={analyzeSelectedVideo}
                disabled={isAnalyzing || !detector}
                className="bg-blue-600 p-3 rounded-lg items-center"
              >
                {isAnalyzing ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold">
                    Analyze Video (MoveNet)
                  </Text>
                )}
              </TouchableOpacity>

              <View className="h-2" />
              <TouchableOpacity
                onPress={async () => {
                  const status = await videoRef.current?.getStatusAsync();
                  if (status && status.isLoaded) {
                    if (status.isPlaying) {
                      await (videoRef.current as any)?.pauseAsync?.();
                    } else {
                      await (videoRef.current as any)?.playAsync?.();
                    }
                  }
                }}
                className="bg-slate-700 p-2 rounded-lg items-center self-start"
              >
                <Text className="text-white text-sm font-semibold">
                  {isPlaying ? "Pause" : "Play"} Video
                </Text>
              </TouchableOpacity>

              {isAnalyzing && (
                <View className="mt-3">
                  <Text className="text-slate-300 text-sm mb-1">
                    Processing frame {frameIndex} / {frameTotal}
                  </Text>
                  <View className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <View
                      className="bg-blue-500 h-2"
                      style={{
                        width: `${frameTotal ? Math.round((frameIndex / frameTotal) * 100) : 0}%`,
                      }}
                    />
                  </View>
                </View>
              )}

              {posesResult && (
                <View className="mt-3">
                  <Text className="text-slate-300 text-sm">
                    Frames processed: {posesResult.length}
                  </Text>
                  <Text className="text-slate-300 text-sm">
                    First frame poses: {posesResult[0]?.poses?.length ?? 0}
                  </Text>
                  <Text className="text-slate-300 text-sm">
                    Frames with ≥1 pose:{" "}
                    {
                      posesResult.filter((f) => (f.poses?.length ?? 0) > 0)
                        .length
                    }
                  </Text>

                  <View className="h-2" />
                  <TouchableOpacity
                    onPress={() => setShowRawJson((v) => !v)}
                    className="bg-slate-700 px-3 py-2 rounded-lg self-start"
                  >
                    <Text className="text-white text-sm font-semibold">
                      {showRawJson
                        ? "Hide Raw Pose JSON"
                        : "Show Raw Pose JSON"}
                    </Text>
                  </TouchableOpacity>
                  {showRawJson && (
                    <ScrollView className="mt-2 max-h-48">
                      <Text className="text-slate-300 text-xs">
                        {JSON.stringify(posesResult, null, 2)}
                      </Text>
                    </ScrollView>
                  )}

                  <View className="h-2" />
                  {posesResult && (
                    <TouchableOpacity
                      onPress={() => setOverlayEnabled((v) => !v)}
                      className="bg-slate-700 p-2 rounded-lg items-center self-start"
                    >
                      <Text className="text-white text-sm font-semibold">
                        {overlayEnabled
                          ? "Hide Video Overlay"
                          : "Show Video Overlay"}
                      </Text>
                    </TouchableOpacity>
                  )}

                  <View className="h-4" />
                  <Text className="text-white font-semibold mb-2">
                    Frames (with poses overlay)
                  </Text>
                  <View className="space-y-3">
                    {posesResult.map((frame) => (
                      <View
                        key={frame.timeMs}
                        className="bg-slate-900 rounded-lg overflow-hidden"
                      >
                        <View
                          pointerEvents="box-none"
                          style={{ width: "100%", height: 220 }}
                          onLayout={(e) =>
                            setThumbOverlaySize({
                              w: e.nativeEvent.layout.width,
                              h: e.nativeEvent.layout.height,
                            })
                          }
                        >
                          <Image
                            source={{ uri: frame.uri ?? "" }}
                            style={{ width: "100%", height: "100%" }}
                            resizeMode="contain"
                          />
                          {/* Pose overlay */}
                          <Svg
                            pointerEvents="none"
                            style={{
                              position: "absolute",
                              width: "100%",
                              height: 220,
                            }}
                          >
                            {(() => {
                              const p = frame.poses?.[0];
                              if (!p || !p.keypoints) return null;
                              const connections: Array<[string, string]> = [
                                ["nose", "left_eye"],
                                ["nose", "right_eye"],
                                ["left_eye", "left_ear"],
                                ["right_eye", "right_ear"],
                                ["left_shoulder", "right_shoulder"],
                                ["left_shoulder", "left_elbow"],
                                ["right_shoulder", "right_elbow"],
                                ["left_elbow", "left_wrist"],
                                ["right_elbow", "right_wrist"],
                                ["left_shoulder", "left_hip"],
                                ["right_shoulder", "right_hip"],
                                ["left_hip", "right_hip"],
                                ["left_hip", "left_knee"],
                                ["right_hip", "right_knee"],
                                ["left_knee", "left_ankle"],
                                ["right_knee", "right_ankle"],
                              ];
                              // Map model coords (192x192) to displayed thumbnail (contain)
                              const modelSize = 192;
                              const origW = frame.width ?? modelSize;
                              const origH = frame.height ?? modelSize;
                              const dstW =
                                thumbOverlaySize?.w ?? screenWidth - 64;
                              const dstH = thumbOverlaySize?.h ?? 220;
                              const scale = Math.min(
                                dstW / origW,
                                dstH / origH
                              );
                              const drawW = origW * scale;
                              const drawH = origH * scale;
                              const offsetX = (dstW - drawW) / 2;
                              const offsetY = (dstH - drawH) / 2;
                              const mapX = (xModel: number) =>
                                offsetX + xModel * (origW / modelSize) * scale;
                              const mapY = (yModel: number) =>
                                offsetY + yModel * (origH / modelSize) * scale;
                              return (
                                <>
                                  {connections.map(([s, e], idx) => {
                                    const sk = p.keypoints.find(
                                      (k) => k.name === s
                                    );
                                    const ek = p.keypoints.find(
                                      (k) => k.name === e
                                    );
                                    if (
                                      sk &&
                                      ek &&
                                      (sk.score ?? 0) > 0.3 &&
                                      (ek.score ?? 0) > 0.3
                                    ) {
                                      const sColor = colorForSide(
                                        getKeypointSide(sk.name)
                                      );
                                      const eColor = colorForSide(
                                        getKeypointSide(ek.name)
                                      );
                                      const stroke =
                                        sColor === eColor ? sColor : "#60a5fa";
                                      return (
                                        <Line
                                          key={`line_${idx}`}
                                          x1={mapX(sk.x)}
                                          y1={mapY(sk.y)}
                                          x2={mapX(ek.x)}
                                          y2={mapY(ek.y)}
                                          stroke={stroke}
                                          strokeWidth={2}
                                        />
                                      );
                                    }
                                    return null;
                                  })}
                                  {p.keypoints
                                    .filter((kp) => (kp.score ?? 0) > 0.3)
                                    .map((kp, i) => (
                                      <Circle
                                        key={`kp_${i}`}
                                        cx={mapX(kp.x)}
                                        cy={mapY(kp.y)}
                                        r={3}
                                        fill={colorForSide(
                                          getKeypointSide(kp.name)
                                        )}
                                        stroke="#fff"
                                        strokeWidth={1}
                                      />
                                    ))}
                                </>
                              );
                            })()}
                          </Svg>
                        </View>
                        <View className="p-2">
                          <Text className="text-slate-400 text-xs">
                            t={frame.timeMs}ms · poses=
                            {frame.poses?.length ?? 0}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
