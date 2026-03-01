import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, PhoneCall, AlertCircle, ShieldAlert, Cpu } from "lucide-react";
import { EmergencyPlan } from "@/services/ai";

interface CriticalBufferScreenProps {
  onCancel: () => void;
  onConfirm: () => void;
  plan: EmergencyPlan | null;
  isAnalyzing: boolean;
}

const CriticalBufferScreen = ({ onCancel, onConfirm, plan, isAnalyzing }: CriticalBufferScreenProps) => {
  const [countdown, setCountdown] = useState(20);
  const [slideX, setSlideX] = useState(0);
  const [isCancelling, setIsCancelling] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const sliderWidth = 320;
  const thumbSize = 60;
  const cancelThreshold = sliderWidth - thumbSize - 8;

  useEffect(() => {
    if (countdown <= 0) {
      onConfirm();
      return;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, onConfirm]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX - slideX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const newX = Math.max(0, Math.min(e.clientX - startX.current, cancelThreshold));
    setSlideX(newX);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    if (slideX >= cancelThreshold * 0.9) {
      setIsCancelling(true);
      setTimeout(onCancel, 300);
    } else {
      setSlideX(0);
    }
  };

  const progress = (countdown / 20) * 100;
  const circumference = 2 * Math.PI * 140;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, filter: "blur(20px)" }}
      className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-critical/5"
    >
      {/* Background Alerts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[-10%] rotate-[-12deg] bg-critical/40 text-background px-20 py-4 font-black text-4xl whitespace-nowrap">
          CRITICAL IMPACT • CRITICAL IMPACT • CRITICAL IMPACT
        </div>
        <div className="absolute bottom-[20%] right-[-10%] rotate-[15deg] bg-critical/40 text-background px-20 py-4 font-black text-4xl whitespace-nowrap">
          ALERT LEVEL 5 • ALERT LEVEL 5 • ALERT LEVEL 5
        </div>
      </div>

      {/* Main Alert Card */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="z-10 w-full max-w-sm"
      >
        <div className="glass-card-heavy p-8 flex flex-col items-center text-center glow-critical">
          <div className="relative mb-10 w-64 h-64 flex items-center justify-center">
            {/* Countdown Ring */}
            <svg width="280" height="280" viewBox="0 0 300 300" className="-rotate-90 absolute">
              <circle
                cx="150" cy="150" r="140"
                fill="none"
                stroke="currentColor"
                className="text-white/5"
                strokeWidth="10"
              />
              <motion.circle
                cx="150" cy="150" r="140"
                fill="none"
                stroke="currentColor"
                className="text-critical"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress / 100)}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference * (1 - progress / 100) }}
                transition={{ duration: 0.5 }}
              />
            </svg>

            {/* Pulsing Core */}
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [1, 0.8, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <span className="text-8xl font-black text-critical tabular-nums tracking-tighter italic">
                {countdown}
              </span>
              <div className="h-1 w-12 bg-critical/30 rounded-full mt-2" />
            </motion.div>
          </div>

          {/* AI Intelligence context */}
          <div className="space-y-4 mb-10 w-full">
            <div className="flex items-center justify-center gap-2 text-critical">
              <ShieldAlert className="w-5 h-5 animate-bounce" />
              <h2 className="text-sm font-black uppercase tracking-widest">Incident Detected</h2>
            </div>
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 text-left relative overflow-hidden">
              {isAnalyzing && (
                <motion.div
                  className="absolute inset-0 bg-safe/10 flex items-center justify-center gap-2 backdrop-blur-sm z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Cpu className="w-5 h-5 text-safe animate-spin" />
                  <span className="text-[10px] font-bold text-safe uppercase tracking-widest">Gemini 1.5 Analysis...</span>
                </motion.div>
              )}
              <p className="text-[11px] text-white/50 font-mono mb-2 uppercase">Platform: Gemini 1.5 Pro Hybrid</p>
              <p className="text-sm text-foreground/90 leading-tight">
                {plan ? (
                  plan.analysis
                ) : (
                  <>
                    High-kinetic collision detected at <span className="text-critical font-bold">14.2G</span>.
                    GPS coordinate broadcast starting in <span className="text-white font-mono">{countdown}s</span>.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Voice Dispatch Action */}
          <motion.button
            onClick={onConfirm}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-14 glass-card border-rescue/30 flex items-center justify-center gap-3 mb-10 group"
          >
            <div className="w-8 h-8 rounded-full bg-rescue/20 flex items-center justify-center group-hover:bg-rescue/40 transition-colors">
              <Mic className="w-4 h-4 text-rescue" />
            </div>
            <span className="text-sm font-bold text-rescue uppercase tracking-wider">Manual Dispatch</span>
          </motion.button>

          {/* New Optimized Slider */}
          <div className="relative">
            <div
              ref={sliderRef}
              className="relative h-16 rounded-3xl bg-white/5 border border-white/10 overflow-hidden backdrop-blur-md"
              style={{ width: sliderWidth }}
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.span
                  className="text-xs font-bold text-muted-foreground/60 uppercase tracking-[0.2em] ml-10"
                  animate={{ opacity: slideX > 40 ? 0 : 1 }}
                >
                  Swipe to Cancel
                </motion.span>
              </div>

              <motion.div
                className="absolute top-1 left-1 bottom-1 flex items-center justify-center rounded-2xl bg-white/10 border border-white/20 backdrop-blur-2xl cursor-grab active:cursor-grabbing touch-none z-20 shadow-xl"
                style={{ width: thumbSize, x: slideX }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                animate={isCancelling ? { scale: 1.5, opacity: 0 } : {}}
              >
                <X className="w-6 h-6 text-white" />
              </motion.div>

              {/* Progress track */}
              <div
                className="absolute inset-y-0 left-0 bg-white/5 pointer-events-none"
                style={{ width: slideX + thumbSize }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CriticalBufferScreen;
