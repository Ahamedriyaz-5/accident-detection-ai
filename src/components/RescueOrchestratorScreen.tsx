import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Navigation, Truck, MapPin, Users, Radio, Share2, Compass, Activity, Bell, X, Heart, CheckCircle, ShieldCheck, Hospital, Send, ExternalLink, AlertCircle } from "lucide-react";
import { EmergencyPlan } from "@/services/ai";

interface RescueOrchestratorScreenProps {
  onBack: () => void;
  plan: EmergencyPlan | null;
}

const TacticalMap = ({ plan }: { plan: EmergencyPlan | null }) => {
  return (
    <div className="relative w-full h-full bg-[#050505] overflow-hidden rounded-t-[3rem] border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
      {/* Tactical Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Radar Ring */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-safe/10"
        animate={{ scale: [0, 1.5], opacity: [0.5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />

      {/* Victim Marker (You) */}
      <motion.div
        className="absolute flex flex-col items-center"
        style={{ top: "45%", left: "40%" }}
      >
        <div className="relative">
          <motion.div
            className="absolute -inset-4 rounded-full bg-critical/20"
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="w-10 h-10 rounded-full bg-critical flex items-center justify-center border-2 border-white shadow-[0_0_20px_rgba(255,0,0,0.5)]">
            <MapPin className="w-5 h-5 text-white" />
          </div>
        </div>
        <span className="mt-2 px-2 py-0.5 rounded-lg bg-critical text-white font-black text-[9px] uppercase tracking-wider">
          {plan?.location.address ? "Impact Site" : "Target Location"}
        </span>
      </motion.div>

      {/* Responder 1: Volunteer */}
      <motion.div
        className="absolute flex flex-col items-center"
        style={{ top: "25%", left: "65%" }}
        animate={{ x: [-10, 0], y: [10, 0] }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
      >
        <div className="w-8 h-8 rounded-xl bg-safe/20 backdrop-blur-md flex items-center justify-center border border-safe shadow-[0_0_15px_rgba(0,255,136,0.3)]">
          <Users className="w-4 h-4 text-safe" />
        </div>
        <span className="mt-2 text-safe font-bold text-[9px] uppercase">
          {plan?.suggestedResponders.find(r => r.type === "volunteer")?.name || "Samaritan: Rohan"}
        </span>
      </motion.div>

      {/* Route Line (Ambulance to Victim) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <motion.line
          x1="20%" y1="70%" x2="40%" y2="45%"
          stroke="currentColor"
          className="text-rescue"
          strokeWidth="2"
          strokeDasharray="4 4"
          initial={{ strokeDashoffset: 100 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      {/* Responder 2: Ambulance */}
      <motion.div
        className="absolute flex flex-col items-center"
        style={{ top: "70%", left: "20%" }}
        animate={{ x: [0, 20], y: [0, -20] }}
        transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
      >
        <div className="relative">
          <motion.div
            className="absolute -inset-2 rounded-full bg-rescue/30"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <div className="relative w-9 h-9 rounded-full bg-rescue/20 backdrop-blur-md flex items-center justify-center border border-rescue shadow-[0_0_15px_rgba(0,200,255,0.3)]">
            <Truck className="w-4 h-4 text-rescue" />
          </div>
        </div>
        <span className="mt-2 text-rescue font-bold text-[9px] uppercase tracking-tighter">
          {plan?.suggestedResponders.find(r => r.type === "ambulance")?.name || "EMS #108"}
        </span>
      </motion.div>

      {/* Tactical HUD Overlays */}
      <div className="absolute top-8 right-8 flex flex-col gap-4 items-end">
        <div className="glass-card px-3 py-2 flex items-center gap-3 border-white/5 shadow-xl">
          <div className="text-right">
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest leading-none mb-1">Family Tracking</p>
            <p className="text-sm font-mono font-bold text-safe">3 ONLINE</p>
          </div>
          <Heart className="w-5 h-5 text-safe/50 fill-safe/20" />
        </div>
        <div className="glass-card px-3 py-2 flex items-center gap-3 border-white/5 shadow-xl">
          <div className="text-right">
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest leading-none mb-1">Elevation</p>
            <p className="text-sm font-mono font-bold text-foreground">142m</p>
          </div>
          <Compass className="w-5 h-5 text-rescue/50" />
        </div>
        <div className="glass-card px-3 py-2 flex items-center gap-3 border-white/5 shadow-xl">
          <div className="text-right">
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest leading-none mb-1">Severity</p>
            <p className="text-sm font-mono font-bold text-critical uppercase">{plan?.severity || "LEVEL 5"}</p>
          </div>
          <motion.div
            className="w-2 h-2 rounded-full bg-critical"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-4/5">
        <div className="glass-card-heavy p-4 flex items-center justify-between border-safe/20">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-safe animate-pulse" />
            <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest">
              {plan?.location.address || "Live telemetry broadcast enabled"}
            </p>
          </div>
          <Share2 className="w-4 h-4 text-safe/50" />
        </div>
      </div>
    </div>
  );
};

const RescueOrchestratorScreen = ({ onBack, plan }: RescueOrchestratorScreenProps) => {
  const [showFamilyMap, setShowFamilyMap] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col bg-[#020202]"
    >
      {/* Control Header */}
      <div className="p-6 pt-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-critical/10 flex items-center justify-center border border-critical/20">
              <Radio className="w-5 h-5 text-critical animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-black text-foreground uppercase tracking-tight italic leading-none">Rescue Command</h1>
            </div>
          </div>
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center bg-white/5"
          >
            <X className="w-4 h-4 text-white/50" />
          </button>
        </div>

        {/* AI Medical Advice */}
        {plan && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass-card p-4 border-safe/20 bg-safe/5"
          >
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-safe" />
              <span className="text-[10px] font-black text-safe uppercase tracking-widest">AI Medical Triage</span>
            </div>
            <ul className="space-y-1">
              {plan.medicalInstructions.slice(0, 2).map((inst, i) => (
                <li key={i} className="text-[11px] text-white/80 flex items-start gap-2">
                  <span className="text-safe">•</span> {inst}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Responder Status Stack */}
        <div className="grid grid-cols-1 gap-4">
          {(plan?.suggestedResponders || []).map((responder, idx) => (
            <motion.div
              key={responder.name}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * (idx + 1) }}
              className={`glass-card p-5 flex items-center justify-between border-${responder.type === 'ambulance' ? 'rescue' : 'safe'}/20 group hover:border-${responder.type === 'ambulance' ? 'rescue' : 'safe'}/40 transition-all`}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-2xl bg-${responder.type === 'ambulance' ? 'rescue' : 'safe'}/10 flex items-center justify-center border border-${responder.type === 'ambulance' ? 'rescue' : 'safe'}/20`}>
                    {responder.type === 'volunteer' ? <Users className="w-6 h-6 text-safe" /> :
                      responder.type === 'family' ? <Heart className="w-6 h-6 text-safe" /> :
                        <Truck className="w-6 h-6 text-rescue" />}
                  </div>
                  <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full bg-${responder.type === 'ambulance' ? 'rescue' : 'safe'} shadow-[0_0_8px_rgba(255,255,255,1)]`} />
                </div>
                <div>
                  <p className="text-sm font-black text-foreground leading-tight">{responder.name}</p>
                  <p className={`text-[11px] text-${responder.type === 'ambulance' ? 'rescue' : 'safe'}/80 font-bold uppercase tracking-wider mt-0.5 italic`}>
                    ETA: {responder.eta} • {responder.distance}
                  </p>
                </div>
              </div>
              {responder.type === 'volunteer' && (
                <button className="w-12 h-12 rounded-2xl bg-safe text-background flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.3)] active:scale-90 transition-transform">
                  <Phone className="w-5 h-5" />
                </button>
              )}
            </motion.div>
          ))}

          {/* New Track Location & Hospital Destination section */}
          {plan?.trackingLinkSent && (
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-4 flex flex-col gap-3 border-safe/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-safe/10 flex items-center justify-center border border-safe/20">
                    <Send className="w-4 h-4 text-safe" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Live Telemetry Sent</p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest">To Self & Family (SMS/WhatsApp)</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-safe/10 border border-safe/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-safe opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-safe"></span>
                  </span>
                  <span className="text-[8px] font-black text-safe uppercase tracking-wider">Broadcasting</span>
                </div>
              </div>

              {plan.hospital && (
                <>
                  <div className="w-full h-[1px] bg-white/5 my-1" />
                  <div className="flex items-center gap-4 py-1">
                    <div className="w-10 h-10 rounded-xl bg-rescue/10 flex items-center justify-center border border-rescue/20">
                      <Hospital className="w-5 h-5 text-rescue" />
                    </div>
                    <div>
                      <span className="text-[8px] text-rescue font-bold uppercase tracking-wider mb-1 block">Destination Hospital</span>
                      <p className="text-sm font-black text-foreground leading-none">{plan.hospital.name}</p>
                      <p className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-wider">{plan.hospital.distance} • {plan.hospital.address}</p>
                    </div>
                  </div>
                </>
              )}

              <div className="w-full h-[1px] bg-white/5 my-1" />
              <button
                onClick={() => setShowFamilyMap(true)}
                className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground hover:bg-white/10 active:scale-95 transition-all mt-1"
              >
                <ExternalLink className="w-4 h-4 text-safe" />
                Preview Family Map Link
              </button>
            </motion.div>
          )}

          {/* Fallback placeholders if no plan */}
          {!plan && (
            <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest py-4 italic">Waiting for AI triage plan...</p>
          )}
        </div>
      </div>

      {/* Map View occupies the rest of the screen */}
      <div className="flex-1 min-h-0">
        <TacticalMap plan={plan} />
      </div>

      {/* Family Map Modal */}
      <AnimatePresence>
        {showFamilyMap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050505] flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-6 pt-10 flex items-center justify-between border-b border-white/10 bg-[#0a0a0a]">
              <div>
                <h2 className="text-lg font-black text-foreground uppercase tracking-tight leading-none">Live Tracking Link</h2>
                <p className="text-xs text-muted-foreground mt-1 font-mono tracking-wider">accident.ai/track/SOS-9X1</p>
              </div>
              <button
                onClick={() => setShowFamilyMap(false)}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 active:scale-90 transition-all"
              >
                <X className="w-5 h-5 text-white/50" />
              </button>
            </div>

            {/* Modal Content - Actual Map View */}
            <div className="flex-1 relative overflow-hidden bg-[#e5e3df]">
              {plan?.location ? (
                <>
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://maps.google.com/maps?saddr=${plan.location.lat},${plan.location.lng}&daddr=${encodeURIComponent((plan.hospital?.name || "") + " " + (plan.hospital?.address || ""))}&z=14&output=embed`}
                    title="Google Maps Location"
                    className="absolute inset-0"
                    style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(85%) contrast(110%)" }}
                    allowFullScreen
                    loading="lazy"
                  />
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&origin=${plan.location.lat},${plan.location.lng}&destination=${encodeURIComponent((plan.hospital?.name || "") + " " + (plan.hospital?.address || ""))}`}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-[240px] right-6 w-14 h-14 rounded-full bg-safe text-[#050505] flex items-center justify-center shadow-[0_0_30px_rgba(0,255,136,0.4)] pointer-events-auto z-20 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Navigation className="w-6 h-6 fill-current" />
                  </a>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-background">Location unavailable</div>
              )}

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute inset-x-6 top-8 glass-card border-critical/30 p-5 shadow-[0_20px_40px_rgba(255,0,0,0.15)] flex items-center gap-4 pointer-events-none"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-critical flex items-center justify-center border-[3px] border-[#050505] shadow-[0_0_20px_rgba(255,0,0,0.4)] relative z-10">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <motion.div className="absolute -inset-4 rounded-full bg-critical/20 z-0" animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Impact Detected</h3>
                  <p className="text-[11px] text-white/70 uppercase tracking-widest mt-1">Status: Extracting & Transporting</p>
                </div>
              </motion.div>

              {/* Patient Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent pt-32 pb-8 px-6">
                <div className="glass-card p-4 border border-white/10 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2">Live Vital Heart Rate</p>
                  <div className="flex items-end justify-center gap-2">
                    <p className="text-4xl font-black text-white">84</p>
                    <p className="text-sm text-safe font-bold mb-1 uppercase">BPM</p>
                  </div>
                  <motion.div className="h-1 bg-safe/30 mt-4 rounded-full overflow-hidden w-full">
                    <motion.div className="h-full bg-safe w-1/4" animate={{ width: ["20%", "40%", "20%"] }} transition={{ duration: 1.5, repeat: Infinity }} />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RescueOrchestratorScreen;
