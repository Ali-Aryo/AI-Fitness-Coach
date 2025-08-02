// @ts-ignore
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// @ts-ignore
import Step1 from "../components/onboarding/Step1";
// @ts-ignore
import Step2 from "../components/onboarding/Step2";
// @ts-ignore
import Step3 from "../components/onboarding/Step3";
// @ts-ignore
import Step4 from "../components/onboarding/Step4";
// @ts-ignore
import Step5 from "../components/onboarding/Step5";
// @ts-ignore
import Step6 from "../components/onboarding/Step6";
// @ts-ignore
import Step7 from "../components/onboarding/Step7";
// @ts-ignore
import Step8 from "../components/onboarding/Step8";

export type OnboardingData = {
  goal?: string;
  location?: string;
  equipment?: string[];
  experience?: string;
  hasStructuredPlan?: boolean;
  age?: number;
  gender?: string;
  height?: { feet: number; inches: number } | { cm: number };
  weight?: { lbs: number } | { kg: number };
  bodyFat?: number;
  daysPerWeek?: number;
  sessionLength?: number;
  preferredTime?: string;
  injuries?: string;
  medicalConditions?: string;
  workoutPreferences?: string[];
  dislikes?: string;
};

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});

  const totalSteps = 8;

  const handleNext = (data: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding and go to signup
      router.push("/signup");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleSkip = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push("/signup");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            onNext={handleNext}
            onBack={handleBack}
            data={onboardingData}
          />
        );
      case 2:
        return (
          <Step2
            onNext={handleNext}
            onBack={handleBack}
            data={onboardingData}
          />
        );
      case 3:
        return (
          <Step3
            onNext={handleNext}
            onBack={handleBack}
            data={onboardingData}
          />
        );
      case 4:
        return (
          <Step4
            onNext={handleNext}
            onBack={handleBack}
            data={onboardingData}
          />
        );
      case 5:
        return (
          <Step5
            onNext={handleNext}
            onBack={handleBack}
            data={onboardingData}
          />
        );
      case 6:
        return (
          <Step6
            onNext={handleNext}
            onBack={handleBack}
            data={onboardingData}
          />
        );
      case 7:
        return (
          <Step7
            onNext={handleNext}
            onBack={handleBack}
            data={onboardingData}
          />
        );
      case 8:
        return (
          <Step8
            onNext={handleNext}
            onBack={handleBack}
            data={onboardingData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <View className="flex-1 bg-slate-900">
        {/* Progress Bar */}
        <View className="h-1 bg-slate-800">
          <View
            className="h-1 bg-blue-600"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </View>
        {/* Step Content */}
        <ScrollView className="flex-1 px-6 pt-4">{renderStep()}</ScrollView>
      </View>
    </SafeAreaView>
  );
}
