import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, CameraType, Camera } from "expo-camera";
import * as ScreenOrientation from "expo-screen-orientation";
import * as ImagePicker from "expo-image-picker";
import { Video, ResizeMode } from "expo-av";

const { width: screenWidth } = Dimensions.get("window");

interface PoseAnalysisResult {
  id: string;
  videoUri: string;
  poseOverlayUri: string;
  timestamp: Date;
  duration: number;
  keypoints: number;
  confidence: number;
}

export default function AnalyzeScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState<CameraType>("back");
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUri, setRecordedVideoUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<PoseAnalysisResult[]>(
    []
  );
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const cameraRef = useRef<CameraView>(null);

  // Request camera permissions on component mount
  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");

      // Set initial orientation
      await ScreenOrientation.getOrientationAsync();
      ScreenOrientation.addOrientationChangeListener(() => {
        // Handle orientation changes if needed
      });
    })();
  }, []);

  const startRecording = async () => {
    if (!cameraRef.current) return;

    try {
      setIsRecording(true);
      console.log("Started recording...");

      // Simulate recording for now
      setTimeout(() => {
        setIsRecording(false);
        const mockVideoUri = "mock-video-uri-" + Date.now();
        setRecordedVideoUri(mockVideoUri);
        setSelectedVideo(mockVideoUri);
        console.log("Recording completed");
      }, 3000);
    } catch (error) {
      console.error("Error starting recording:", error);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (!cameraRef.current) return;

    try {
      setIsRecording(false);
      console.log("Stopped recording");
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const videoUri = result.assets[0].uri;
        setSelectedVideo(videoUri);
        setRecordedVideoUri(null);
        console.log("Video selected:", videoUri);
      }
    } catch (error) {
      console.error("Error picking video:", error);
      Alert.alert("Error", "Failed to pick video");
    }
  };

  const analyzeVideo = async () => {
    if (!selectedVideo) {
      Alert.alert("No Video", "Please record or select a video first");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate pose detection processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const result: PoseAnalysisResult = {
        id: Date.now().toString(),
        videoUri: selectedVideo,
        poseOverlayUri: selectedVideo, // In real app, this would be the processed video
        timestamp: new Date(),
        duration: 15, // Mock duration in seconds
        keypoints: 17, // MoveNet detects 17 keypoints
        confidence: 0.89, // Mock confidence score
      };

      setAnalysisResults((prev) => [result, ...prev]);
      Alert.alert(
        "Success",
        "Pose analysis completed! Check your results below."
      );
    } catch (error) {
      console.error("Error analyzing video:", error);
      Alert.alert("Error", "Failed to analyze video");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderCameraView = () => (
    <View className="bg-black rounded-xl overflow-hidden mb-4">
      <CameraView
        ref={cameraRef}
        style={{ width: screenWidth - 48, height: 300 }}
        facing={cameraType}
        onCameraReady={() => console.log("Camera ready")}
      />

      {/* Camera Controls Overlay */}
      <View className="absolute bottom-4 left-0 right-0 flex-row justify-center items-center">
        <TouchableOpacity
          onPress={() =>
            setCameraType(cameraType === "back" ? "front" : "back")
          }
          className="bg-slate-800/80 p-3 rounded-full mr-4"
        >
          <Ionicons name="camera-reverse" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={isRecording ? stopRecording : startRecording}
          className={`w-16 h-16 rounded-full border-4 border-white items-center justify-center ${
            isRecording ? "bg-red-600" : "bg-white"
          }`}
        >
          <Ionicons
            name={isRecording ? "stop" : "play"}
            size={24}
            color={isRecording ? "white" : "black"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowCamera(false)}
          className="bg-slate-800/80 p-3 rounded-full ml-4"
        >
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderVideoPreview = () => {
    if (!selectedVideo) return null;

    return (
      <View className="bg-slate-800 rounded-xl p-4 mb-4">
        <Text className="text-white font-semibold mb-2">Selected Video</Text>
        <View className="bg-black rounded-lg overflow-hidden mb-3">
          <Video
            source={{ uri: selectedVideo }}
            style={{ width: "100%", height: 200 }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay={false}
          />
        </View>
        <TouchableOpacity
          onPress={analyzeVideo}
          disabled={isProcessing}
          className="bg-blue-600 p-3 rounded-lg items-center"
        >
          {isProcessing ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold">Analyze Video</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderAnalysisResults = () => {
    if (analysisResults.length === 0) return null;

    return (
      <View className="mb-6">
        <Text className="text-xl font-semibold text-white mb-4">
          Analysis Results
        </Text>
        {analysisResults.map((result) => (
          <View key={result.id} className="bg-slate-800 p-4 rounded-xl mb-3">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-white font-semibold">
                Pose Analysis #{result.id.slice(-4)}
              </Text>
              <Text className="text-slate-400 text-sm">
                {result.timestamp.toLocaleDateString()}
              </Text>
            </View>

            <View className="flex-row justify-between mb-3">
              <View>
                <Text className="text-slate-400 text-sm">Duration</Text>
                <Text className="text-white">{result.duration}s</Text>
              </View>
              <View>
                <Text className="text-slate-400 text-sm">Keypoints</Text>
                <Text className="text-white">{result.keypoints}</Text>
              </View>
              <View>
                <Text className="text-slate-400 text-sm">Confidence</Text>
                <Text className="text-white">
                  {(result.confidence * 100).toFixed(0)}%
                </Text>
              </View>
            </View>

            <TouchableOpacity className="bg-blue-600 p-2 rounded-lg items-center">
              <Text className="text-white font-semibold">
                View with Pose Overlay
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView className="flex-1 bg-slate-900">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-white mt-4">
            Requesting camera permissions...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView className="flex-1 bg-slate-900">
        <View className="flex-1 justify-center items-center p-6">
          <Ionicons name="camera" size={64} color="#64748b" />
          <Text className="text-white text-xl font-semibold mt-4 mb-2">
            Camera Access Required
          </Text>
          <Text className="text-slate-400 text-center mb-6">
            This feature needs camera access to record videos for pose analysis.
          </Text>
          <TouchableOpacity
            onPress={() => Camera.requestCameraPermissionsAsync()}
            className="bg-blue-600 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-white mb-2">Analyze</Text>
            <Text className="text-slate-400">
              Record or upload videos to analyze your workout form
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="flex-row space-x-3 mb-6">
            <TouchableOpacity
              onPress={() => setShowCamera(true)}
              className="flex-1 bg-blue-600 p-4 rounded-xl items-center"
            >
              <Ionicons name="camera" size={24} color="white" />
              <Text className="text-white font-semibold mt-2">
                Record Video
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={pickVideo}
              className="flex-1 bg-slate-700 p-4 rounded-xl items-center"
            >
              <Ionicons name="folder-open" size={24} color="white" />
              <Text className="text-white font-semibold mt-2">
                Upload Video
              </Text>
            </TouchableOpacity>
          </View>

          {/* Camera View */}
          {showCamera && renderCameraView()}

          {/* Video Preview */}
          {renderVideoPreview()}

          {/* Analysis Results */}
          {renderAnalysisResults()}

          {/* Instructions */}
          <View className="bg-slate-800 p-4 rounded-xl">
            <Text className="text-white font-semibold mb-2">How it works:</Text>
            <Text className="text-slate-400 text-sm leading-5">
              1. Record a video of your workout or upload an existing one{"\n"}
              2. Our AI will analyze your form and detect key body positions
              {"\n"}
              3. Get a video with pose overlay showing your movement patterns
              {"\n"}
              4. Use the insights to improve your form and prevent injuries
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
