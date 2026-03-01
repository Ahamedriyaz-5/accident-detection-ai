import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Shield, Phone, User, Mail, Heart, Mic, MapPin, Bell,
    Camera, ChevronRight, ChevronLeft, Plus, Trash2, ArrowLeft, Zap, AlertCircle, Globe
} from "lucide-react";
import { useUser, UserProfile } from "@/contexts/UserContext";
import { toast } from "sonner";

// ── Validators ─────────────────────────────────────────────────────────────────

const isValidPhone = (v: string) => /^\d{10}$/.test(v.replace(/\D/g, ""));
const isValidGmail = (v: string) => v === "" || /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(v);

// ── Permission Toggle ──────────────────────────────────────────────────────────

const PermissionToggle = ({
    icon: Icon,
    label,
    description,
    color,
    value,
    onChange,
}: {
    icon: any; label: string; description: string; color: string;
    value: boolean; onChange: (v: boolean) => void;
}) => (
    <div
        onClick={() => onChange(!value)}
        className={`glass-card p-4 flex items-center gap-4 cursor-pointer transition-all border ${value ? `border-${color}/40 bg-${color}/5` : "border-white/5"
            }`}
    >
        <div className={`w-11 h-11 rounded-2xl bg-${color}/10 flex items-center justify-center border border-${color}/20 flex-shrink-0`}>
            <Icon className={`w-5 h-5 text-${color}`} />
        </div>
        <div className="flex-1">
            <p className="text-sm font-bold text-foreground leading-none">{label}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{description}</p>
        </div>
        <div className={`w-12 h-7 rounded-full border flex items-center px-1 transition-all duration-300 ${value ? `bg-${color}/30 border-${color}/50` : "bg-white/5 border-white/10"
            }`}>
            <motion.div
                className={`w-5 h-5 rounded-full ${value ? `bg-${color}` : "bg-white/30"}`}
                animate={{ x: value ? 16 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
        </div>
    </div>
);

// ── Input Field (no label, placeholder only) ───────────────────────────────────

const InputField = ({
    icon: Icon,
    placeholder,
    value,
    onChange,
    type = "text",
    color = "safe",
    error,
    maxLength,
}: {
    icon: any; placeholder: string; value: string;
    onChange: (v: string) => void; type?: string;
    color?: string; error?: string; maxLength?: number;
}) => (
    <div className="flex flex-col gap-1">
        <div className={`glass-card flex items-center gap-3 px-4 py-3.5 border transition-all ${error ? "border-critical/50 bg-critical/5" : `border-white/10 focus-within:border-${color}/40`
            }`}>
            <Icon className={`w-4 h-4 flex-shrink-0 ${error ? "text-critical/60" : `text-${color}/60`}`} />
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                maxLength={maxLength}
                onChange={e => onChange(e.target.value)}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 outline-none"
            />
            {error && <AlertCircle className="w-4 h-4 text-critical/60 flex-shrink-0" />}
        </div>
        {error && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="text-[10px] text-critical font-medium px-1">
                {error}
            </motion.p>
        )}
    </div>
);

// ── Step progress bar ──────────────────────────────────────────────────────────

const STEPS = ["Account", "Medical", "Family", "Permissions"];

const StepBar = ({ step }: { step: number }) => (
    <div className="flex gap-1.5 mb-6">
        {STEPS.map((_, i) => (
            <motion.div
                key={i}
                className="h-1.5 rounded-full bg-white/10 overflow-hidden flex-1"
                animate={{}}
            >
                <motion.div
                    className="h-full rounded-full bg-safe"
                    initial={{ width: "0%" }}
                    animate={{ width: i <= step ? "100%" : "0%" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                />
            </motion.div>
        ))}
    </div>
);

// ── SIGN UP WIZARD ─────────────────────────────────────────────────────────────

const SignUpWizard = ({ onBack }: { onBack: () => void }) => {
    const { register } = useUser();
    const [step, setStep] = useState(0);
    const [dir, setDir] = useState(1);
    const [isLocating, setIsLocating] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [form, setForm] = useState({
        name: "",
        phone: "",
        alternatePhone: "",
        email: "",
        bloodType: "O+",
        allergies: "",
        familyContacts: [{ name: "", phone: "" }],
        permissions: { gps: false, microphone: false, notifications: false, camera: false },
    });

    const set = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }));
    const setPermission = (key: keyof typeof form.permissions, val: boolean) =>
        setForm(f => ({ ...f, permissions: { ...f.permissions, [key]: val } }));

    const clearError = (key: string) => setErrors(e => { const n = { ...e }; delete n[key]; return n; });

    // ── Validate step 0 ──
    const validateStep0 = () => {
        const errs: Record<string, string> = {};
        if (!form.name.trim() || form.name.trim().length < 2) errs.name = "Enter at least 2 characters";
        if (!isValidPhone(form.phone)) errs.phone = "Enter a valid 10-digit mobile number";
        if (form.alternatePhone && !isValidPhone(form.alternatePhone))
            errs.alternatePhone = "Enter a valid 10-digit number";
        if (!isValidGmail(form.email)) errs.email = "Only Gmail addresses allowed (e.g. you@gmail.com)";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const requestGPS = useCallback(async () => {
        setIsLocating(true);
        try {
            await new Promise<GeolocationPosition>((res, rej) =>
                navigator.geolocation.getCurrentPosition(res, rej, { timeout: 8000 })
            );
            setPermission("gps", true);
            toast.success("GPS Location Locked ✓");
        } catch {
            toast.error("GPS access denied. Enable in browser settings.");
        } finally { setIsLocating(false); }
    }, []);

    const requestMicrophone = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(t => t.stop());
            setPermission("microphone", true);
            toast.success("Microphone Access Granted ✓");
        } catch {
            toast.error("Microphone access denied.");
        }
    }, []);

    const addFamilyContact = () =>
        set("familyContacts", [...form.familyContacts, { name: "", phone: "" }]);

    const removeFamilyContact = (i: number) =>
        set("familyContacts", form.familyContacts.filter((_, idx) => idx !== i));

    const updateFamilyContact = (i: number, key: "name" | "phone", val: string) =>
        set("familyContacts", form.familyContacts.map((c, idx) => idx === i ? { ...c, [key]: val } : c));

    const goNext = () => {
        if (step === 0 && !validateStep0()) return;
        setDir(1);
        setStep(s => s + 1);
    };

    const goPrev = () => {
        setDir(-1);
        setStep(s => s - 1);
    };

    const handleFinish = () => {
        const profile: UserProfile = {
            name: form.name.trim(),
            phone: form.phone.replace(/\D/g, ""),
            alternatePhone: form.alternatePhone.replace(/\D/g, ""),
            email: form.email,
            bloodType: form.bloodType,
            allergies: form.allergies,
            familyContacts: form.familyContacts.filter(c => c.name && c.phone),
            permissions: form.permissions,
        };
        register(profile);
        toast.success(`Welcome, ${form.name.trim()}! Accident AI activated.`);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col p-6 pt-10"
        >
            {/* Top nav */}
            <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground mb-6 hover:text-white transition-colors self-start">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Back to Login</span>
            </button>

            <StepBar step={step} />

            <div className="mb-5">
                <p className="text-[10px] text-safe uppercase tracking-widest font-bold mb-1">Step {step + 1} of {STEPS.length}</p>
                <h2 className="text-2xl font-black text-foreground tracking-tight">{STEPS[step]}</h2>
                <p className="text-[11px] text-muted-foreground mt-1">
                    {step === 0 && "Your identity & contact details"}
                    {step === 1 && "Medical info shared with first responders"}
                    {step === 2 && "Family / emergency contacts to notify on SOS"}
                    {step === 3 && "Device permissions that power rescue features"}
                </p>
            </div>

            <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                    key={step}
                    custom={dir}
                    initial={{ x: dir * 60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: dir * -60, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="flex-1 flex flex-col gap-3"
                >
                    {/* ── STEP 0: Account ── */}
                    {step === 0 && (
                        <>
                            <InputField
                                icon={User} placeholder="Full Name"
                                value={form.name} onChange={v => { set("name", v); clearError("name"); }}
                                error={errors.name}
                            />
                            <InputField
                                icon={Phone} placeholder="Phone Number"
                                value={form.phone} type="tel" maxLength={10}
                                onChange={v => { set("phone", v.replace(/\D/g, "").slice(0, 10)); clearError("phone"); }}
                                error={errors.phone}
                            />
                            <InputField
                                icon={Phone} placeholder="Alternate Phone"
                                value={form.alternatePhone} type="tel" maxLength={10} color="rescue"
                                onChange={v => { set("alternatePhone", v.replace(/\D/g, "").slice(0, 10)); clearError("alternatePhone"); }}
                                error={errors.alternatePhone}
                            />
                            <InputField
                                icon={Mail} placeholder="Gmail address"
                                value={form.email} type="email" color="rescue"
                                onChange={v => { set("email", v); clearError("email"); }}
                                error={errors.email}
                            />
                        </>
                    )}

                    {/* ── STEP 1: Medical ── */}
                    {step === 1 && (
                        <>
                            <div className="flex flex-col gap-2">
                                <p className="text-[10px] text-muted-foreground/70 uppercase tracking-widest font-bold px-1">Blood Type</p>
                                <div className="grid grid-cols-4 gap-2">
                                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bt => (
                                        <button
                                            key={bt}
                                            onClick={() => set("bloodType", bt)}
                                            className={`py-3 rounded-xl text-sm font-black transition-all border ${form.bloodType === bt
                                                ? "bg-critical text-white border-critical shadow-[0_0_20px_rgba(255,0,0,0.3)]"
                                                : "glass-card border-white/10 text-muted-foreground hover:border-white/20"
                                                }`}
                                        >
                                            {bt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <InputField
                                icon={Heart} placeholder="Known Allergies / Conditions"
                                value={form.allergies} onChange={v => set("allergies", v)} color="critical"
                            />
                        </>
                    )}

                    {/* ── STEP 2: Family Contacts ── */}
                    {step === 2 && (
                        <div className="flex flex-col gap-3">
                            <p className="text-[10px] text-muted-foreground mb-1">
                                These contacts receive your live location when SOS triggers.
                            </p>
                            {form.familyContacts.map((c, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="glass-card p-4 flex flex-col gap-2.5 border border-white/5"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-rescue font-black uppercase tracking-widest">Contact {i + 1}</span>
                                        {i > 0 && (
                                            <button onClick={() => removeFamilyContact(i)} className="text-critical/50 hover:text-critical transition-colors">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        placeholder="Full Name"
                                        value={c.name}
                                        onChange={e => updateFamilyContact(i, "name", e.target.value)}
                                        className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 outline-none border-b border-white/10 pb-2"
                                    />
                                    <input
                                        placeholder="Phone Number"
                                        value={c.phone}
                                        maxLength={10}
                                        type="tel"
                                        onChange={e => updateFamilyContact(i, "phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                                        className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 outline-none"
                                    />
                                </motion.div>
                            ))}
                            {form.familyContacts.length < 4 && (
                                <button
                                    onClick={addFamilyContact}
                                    className="glass-card border border-dashed border-white/20 p-3 flex items-center justify-center gap-2 text-muted-foreground hover:border-safe/40 hover:text-safe transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Add Contact</span>
                                </button>
                            )}
                        </div>
                    )}

                    {/* ── STEP 3: Permissions ── */}
                    {step === 3 && (
                        <div className="flex flex-col gap-3">
                            <p className="text-[10px] text-muted-foreground mb-1">
                                These permissions enable the full emergency protection suite.
                            </p>

                            <div onClick={() => { if (!form.permissions.gps) requestGPS(); else setPermission("gps", false); }}>
                                <PermissionToggle
                                    icon={MapPin} label="GPS Location"
                                    description="Real-time tracking & nearest responder dispatch"
                                    color="safe" value={form.permissions.gps} onChange={() => { }}
                                />
                            </div>
                            {isLocating && (
                                <p className="text-[10px] text-safe/70 text-center animate-pulse">Acquiring GPS signal...</p>
                            )}

                            <div onClick={() => { if (!form.permissions.microphone) requestMicrophone(); else setPermission("microphone", false); }}>
                                <PermissionToggle
                                    icon={Mic} label="Voice / Microphone"
                                    description="Voice dispatch & audio monitoring during emergency"
                                    color="rescue" value={form.permissions.microphone} onChange={() => { }}
                                />
                            </div>

                            <PermissionToggle
                                icon={Bell} label="Notifications"
                                description="Critical alerts, ETA updates, and family pings"
                                color="warning" value={form.permissions.notifications}
                                onChange={v => setPermission("notifications", v)}
                            />

                            <PermissionToggle
                                icon={Camera} label="Camera"
                                description="Accident scene capture for emergency report"
                                color="critical" value={form.permissions.camera}
                                onChange={v => setPermission("camera", v)}
                            />
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* ── Navigation buttons ── */}
            <div className="flex gap-3 mt-8 pb-2">
                {/* PREVIOUS button — visible on steps 1+ */}
                {step > 0 && (
                    <button
                        onClick={goPrev}
                        className="h-14 px-5 rounded-2xl glass-card border border-white/10 text-muted-foreground flex items-center gap-2 font-black text-sm uppercase tracking-widest hover:border-white/20 hover:text-white transition-all active:scale-95"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Prev
                    </button>
                )}

                {step < STEPS.length - 1 ? (
                    <button
                        onClick={goNext}
                        className="flex-1 h-14 rounded-2xl flex items-center justify-center gap-2 font-black text-sm uppercase tracking-widest bg-safe text-background shadow-[0_0_30px_rgba(0,255,136,0.3)] active:scale-95 transition-all"
                    >
                        Continue
                        <ChevronRight className="w-5 h-5" />
                    </button>
                ) : (
                    <button
                        onClick={handleFinish}
                        className="flex-1 h-14 rounded-2xl flex items-center justify-center gap-2 font-black text-sm uppercase tracking-widest bg-safe text-background shadow-[0_0_30px_rgba(0,255,136,0.4)] active:scale-95 transition-all"
                    >
                        Activate Accident AI
                        <Zap className="w-5 h-5" />
                    </button>
                )}
            </div>
        </motion.div>
    );
};

// ── LOGIN SCREEN ───────────────────────────────────────────────────────────────

const LoginScreen = ({ onSignUp }: { onSignUp: () => void }) => {
    const { login } = useUser();
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");

    const handleLogin = () => {
        setError("");
        if (!phone) { setError("Enter your registered 10-digit phone number."); return; }
        if (!isValidPhone(phone)) { setError("Phone must be exactly 10 digits."); return; }
        const ok = login(phone.replace(/\D/g, ""));
        if (!ok) setError("Phone not found. Please create an account first.");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="min-h-screen flex flex-col justify-center p-6"
        >
            {/* Logo */}
            <div className="flex flex-col items-center mb-12">
                <motion.div
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-24 h-24 rounded-3xl bg-critical/10 flex items-center justify-center border border-critical/30 mb-6 shadow-[0_0_40px_rgba(255,0,0,0.2)]"
                >
                    <Shield className="w-12 h-12 text-critical" />
                </motion.div>
                <h1 className="text-3xl font-black text-foreground tracking-tight">Accident AI</h1>
                <p className="text-sm text-muted-foreground mt-1">Emergency Response System</p>
                <div className="flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-safe/10 border border-safe/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse" />
                    <span className="text-[10px] font-bold text-safe uppercase tracking-wider">Gemini 1.5 Pro Powered</span>
                </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
                <InputField
                    icon={Phone}
                    placeholder="10-digit Registered Phone Number"
                    value={phone}
                    onChange={v => { setPhone(v.replace(/\D/g, "").slice(0, 10)); setError(""); }}
                    type="tel"
                    maxLength={10}
                    error={error}
                />

                <button
                    onClick={handleLogin}
                    className="w-full h-14 rounded-2xl bg-safe text-background font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,255,136,0.3)] active:scale-95 transition-all"
                >
                    <Shield className="w-5 h-5" />
                    Access Command Center
                </button>

                <div className="flex items-center gap-4">
                    <div className="flex-1 h-[1px] bg-white/10" />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">or</span>
                    <div className="flex-1 h-[1px] bg-white/10" />
                </div>

                <button
                    onClick={onSignUp}
                    className="w-full h-14 rounded-2xl glass-card border border-white/10 text-foreground font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all hover:border-white/20"
                >
                    <User className="w-5 h-5 text-muted-foreground" />
                    Create New Account
                </button>
            </div>
        </motion.div>
    );
};

// ── MAIN AUTH SCREEN ───────────────────────────────────────────────────────────

const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिंदी (Hindi)" },
    { code: "ml", label: "മലയാളം (Malayalam)" },
    { code: "ta", label: "தமிழ் (Tamil)" },
    { code: "te", label: "తెలుగు (Telugu)" },
    { code: "kn", label: "ಕನ್ನಡ (Kannada)" },
    { code: "bn", label: "বাংলা (Bengali)" },
    { code: "mr", label: "मराठी (Marathi)" },
    { code: "gu", label: "ગુજરાતી (Gujarati)" },
    { code: "pa", label: "ਪੰਜਾਬੀ (Punjabi)" },
    { code: "ur", label: "اردو (Urdu)" },
];

const LanguageSelector = () => {
    const setCookie = (name: string, value: string, days: number) => {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
    };

    const changeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setCookie("googtrans", `/en/${val}`, 1);
        window.location.reload();
    };

    // Helper to get cookie and set default select value
    const [currentLang, setCurrentLang] = useState("en");
    useEffect(() => {
        const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
        if (match && match[1]) {
            setCurrentLang(match[1]);
        }
    }, []);

    return (
        <div className="absolute top-6 right-6 z-50 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <select
                value={currentLang}
                onChange={changeLang}
                className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer appearance-none"
                style={{ WebkitAppearance: 'none' }}
                defaultValue="en"
            >
                {LANGUAGES.map(l => (
                    <option key={l.code} value={l.code} className="bg-[#050505] text-white">
                        {l.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

const AuthScreen = () => {
    const [mode, setMode] = useState<"login" | "signup">("login");

    return (
        <div className="min-h-screen bg-background max-w-md mx-auto relative overflow-hidden mesh-gradient">
            <LanguageSelector />
            <div className="scan-line z-0" />
            <AnimatePresence mode="wait">
                {mode === "login" ? (
                    <LoginScreen key="login" onSignUp={() => setMode("signup")} />
                ) : (
                    <SignUpWizard key="signup" onBack={() => setMode("login")} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default AuthScreen;
