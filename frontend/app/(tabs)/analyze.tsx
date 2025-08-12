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
  const [posesResult, setPosesResult] = useState<any[] | null>(null);
  const [detector, setDetector] = useState<posedetection.PoseDetector | null>(
    null
  );
  const videoRef = useRef<Video>(null);
  const [frameTotal, setFrameTotal] = useState<number>(0);
  const [frameIndex, setFrameIndex] = useState<number>(0);
  const [showRawJson, setShowRawJson] = useState<boolean>(false);

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

      const frameCount = 8;
      const times: number[] = [];
      if (durationMs && durationMs > 0) {
        const step = durationMs / (frameCount + 1);
        for (let i = 1; i <= frameCount; i++) times.push(Math.floor(i * step));
      } else {
        for (let i = 0; i < frameCount; i++) times.push(i * 500);
      }

      const posesAccum: any[] = [];
      setFrameTotal(times.length);
      setFrameIndex(0);
      for (let i = 0; i < times.length; i++) {
        const t = times[i];
        const { uri: thumbUri } = await VideoThumbnails.getThumbnailAsync(
          selectedVideoUri,
          { time: t }
        );
        const res = await fetch(thumbUri);
        const buf = await res.arrayBuffer();
        const jpeg = new Uint8Array(buf);

        const image = decodeJpeg(jpeg, 3);
        const input = tf.image.resizeBilinear(image, [192, 192]) as tf.Tensor3D;
        const result = await detector.estimatePoses(input, {
          flipHorizontal: false,
        });
        tf.dispose([image, input]);
        posesAccum.push({ timeMs: t, poses: result });

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
                <Video
                  ref={videoRef}
                  source={{ uri: selectedVideoUri }}
                  style={{ width: "100%", height: 220 }}
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                  shouldPlay={false}
                />
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
                        <View style={{ width: "100%", height: 220 }}>
                          <Image
                            source={{ uri: (frame as any).uri ?? "" }}
                            style={{ width: "100%", height: "100%" }}
                            resizeMode="contain"
                          />
                          {/* Pose overlay */}
                          <Svg
                            style={{
                              position: "absolute",
                              width: "100%",
                              height: 220,
                            }}
                          >
                            {(() => {
                              const p = (frame as any).poses?.[0];
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
                              return (
                                <>
                                  {connections.map(([s, e], idx) => {
                                    const sk = p.keypoints.find(
                                      (k: any) => k.name === s
                                    );
                                    const ek = p.keypoints.find(
                                      (k: any) => k.name === e
                                    );
                                    if (
                                      sk &&
                                      ek &&
                                      (sk.score ?? 0) > 0.3 &&
                                      (ek.score ?? 0) > 0.3
                                    ) {
                                      return (
                                        <Line
                                          key={`line_${idx}`}
                                          x1={sk.x}
                                          y1={sk.y}
                                          x2={ek.x}
                                          y2={ek.y}
                                          stroke="#22c55e"
                                          strokeWidth={2}
                                        />
                                      );
                                    }
                                    return null;
                                  })}
                                  {p.keypoints
                                    .filter((kp: any) => (kp.score ?? 0) > 0.3)
                                    .map((kp: any, i: number) => (
                                      <Circle
                                        key={`kp_${i}`}
                                        cx={kp.x}
                                        cy={kp.y}
                                        r={3}
                                        fill="#22c55e"
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
                            {(frame as any).poses?.length ?? 0}
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
