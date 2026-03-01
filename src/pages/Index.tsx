import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import GuardianScreen from "@/components/GuardianScreen";
import CriticalBufferScreen from "@/components/CriticalBufferScreen";
import RescueOrchestratorScreen from "@/components/RescueOrchestratorScreen";
import { getAdvancedEmergencyPlan, EmergencyPlan } from "@/services/ai";
import { toast } from "sonner";

type AppScreen = "guardian" | "critical" | "rescue";

const Index = () => {
  const [screen, setScreen] = useState<AppScreen>("guardian");
  const [emergencyPlan, setEmergencyPlan] = useState<EmergencyPlan | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSOS = useCallback(async () => {
    setScreen("critical");
    setIsAnalyzing(true);

    try {
      // Simulate sensor data being sent to AI
      const plan = await getAdvancedEmergencyPlan({ gForce: 14.2, timestamp: Date.now() });
      setEmergencyPlan(plan);
      toast.success("AI Analysis Complete: Emergency Plan Generated", {
        description: `Severity: ${plan.severity.toUpperCase()}`,
      });
    } catch (error) {
      console.error("AI Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleCancel = useCallback(() => {
    setScreen("guardian");
    setEmergencyPlan(null);
  }, []);

  const handleConfirm = useCallback(() => setScreen("rescue"), []);
  const handleBack = useCallback(() => {
    setScreen("guardian");
    setEmergencyPlan(null);
  }, []);

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative overflow-hidden mesh-gradient">
      <div className="scan-line z-0" />
      <AnimatePresence mode="wait">
        {screen === "guardian" && (
          <GuardianScreen key="guardian" onTriggerSOS={handleSOS} />
        )}
        {screen === "critical" && (
          <CriticalBufferScreen
            key="critical"
            onCancel={handleCancel}
            onConfirm={handleConfirm}
            plan={emergencyPlan}
            isAnalyzing={isAnalyzing}
          />
        )}
        {screen === "rescue" && (
          <RescueOrchestratorScreen
            key="rescue"
            onBack={handleBack}
            plan={emergencyPlan}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
