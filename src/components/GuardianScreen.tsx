import { motion } from "framer-motion";
import { Shield, Phone, Heart, Droplets, AlertTriangle, Activity, Zap, Map, LogOut } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

interface GuardianScreenProps {
  onTriggerSOS: () => void;
}

const ActivityPulse = () => {
  return (
    <div className="flex items-center gap-1 h-8">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <motion.div
          key={i}
          className="w-1 bg-safe rounded-full"
          animate={{
            height: [8, Math.random() * 24 + 4, 8],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const SensorCard = ({ icon: Icon, label, value, colorClass }: { icon: any, label: string, value: string, colorClass: string }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="glass-card p-3 flex flex-col gap-2 inner-glow"
  >
    <div className="flex items-center justify-between">
      <Icon className={`w-4 h-4 ${colorClass}`} />
      <div className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse" />
    </div>
    <div>
      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-foreground">{value}</p>
    </div>
    <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
      <motion.div
        className={`h-full ${colorClass.replace('text-', 'bg-')}`}
        initial={{ width: "0%" }}
        animate={{ width: "70%" }}
        transition={{ duration: 2, delay: 1 }}
      />
    </div>
  </motion.div>
);

const GuardianScreen = ({ onTriggerSOS }: GuardianScreenProps) => {
  const { user, logout } = useUser();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen flex flex-col p-6 pb-40 overflow-hidden"
    >
      {/* Top Header - System Health */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card glow-safe p-5 flex items-center justify-between border-safe/20 mb-6"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-safe/10 flex items-center justify-center border border-safe/30">
              <Shield className="w-6 h-6 text-safe" />
            </div>
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-safe border-2 border-background shadow-[0_0_8px_rgba(0,255,136,1)]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">{user?.name || "Accident AI"}</h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-safe uppercase tracking-widest">Advanced AI Active</span>
              <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
              <span className="text-[10px] text-muted-foreground font-mono">GEMINI 1.5 PRO</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ActivityPulse />
          <button onClick={logout} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/10 transition-all" title="Logout">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>

      {/* Medical Profile Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Bio-Metric Profile</h2>
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-safe" />
            <span className="text-[10px] text-safe font-medium">Syncing...</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-4 space-y-3">
            <div className="flex items-center gap-2 text-critical">
              <Heart className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Health Info</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] text-muted-foreground">Blood Type</p>
                <p className="text-2xl font-black text-foreground">{user?.bloodType || "O+"}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground">Allergies</p>
                <p className="text-sm font-bold text-foreground">{user?.allergies || "None"}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 space-y-3">
            <div className="flex items-center gap-2 text-rescue">
              <Phone className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Contacts</span>
            </div>
            <div className="space-y-2">
              {(user?.familyContacts?.slice(0, 2) || [{ name: "Emergency", phone: "911" }]).map((c, i) => (
                <div key={i}>
                  <p className="text-[11px] font-bold text-foreground leading-none">{c.name}</p>
                  <p className="text-[9px] text-muted-foreground italic">{i === 0 ? "Primary Kin" : "Secondary"} • {c.phone}</p>
                  {i < 1 && <div className="h-[1px] bg-white/5 w-full mt-2" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sensor Grid */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Environmental Sensors</h2>
          <Zap className="w-3.5 h-3.5 text-warning" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <SensorCard icon={Activity} label="G-Force" value="1.02 G" colorClass="text-safe" />
          <SensorCard icon={Zap} label="Impact" value="Nominal" colorClass="text-warning" />
          <SensorCard icon={Map} label="GPS Status" value="Locked" colorClass="text-rescue" />
          <SensorCard icon={Activity} label="Barometer" value="1013 hPa" colorClass="text-safe" />
        </div>
      </motion.div>

      {/* SOS FAB - The Centerpiece */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 p-4"
      >
        <div className="relative group">
          {/* Animated Background Rings */}
          <motion.div
            className="absolute inset-0 rounded-full bg-critical opacity-20 scale-125"
            animate={{ scale: [1.2, 1.8, 1.2], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-critical opacity-10 scale-150"
            animate={{ scale: [1.5, 2.2, 1.5], opacity: [0.1, 0, 0.1] }}
            transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
          />

          <button
            onClick={onTriggerSOS}
            className="relative w-28 h-28 rounded-full bg-critical flex flex-col items-center justify-center text-critical-foreground overflow-hidden shadow-[0_0_50px_rgba(255,0,0,0.5)] active:scale-90 transition-all duration-300 group-hover:shadow-[0_0_70px_rgba(255,0,0,0.7)]"
          >
            {/* Gloss Highlight */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 blur-xl translate-y-[-50%]" />

            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <AlertTriangle className="w-8 h-8 mb-1" />
            </motion.div>
            <span className="text-xl font-black tracking-tighter italic">SOS</span>
          </button>

          <motion.p
            className="text-center text-[10px] font-bold text-critical uppercase tracking-widest mt-4 drop-shadow-lg"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            Hold for Emergency
          </motion.p>
        </div>
      </motion.div>

      {/* Soft Bottom Gradient Overlay */}
      <div className="fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-40" />
    </motion.div>
  );
};

export default GuardianScreen;
