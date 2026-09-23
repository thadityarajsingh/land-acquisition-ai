import React, { useState } from "react";
import {
  Shield,
  Eye,
  EyeOff,
  ChevronRight,
  MapPin,
  AlertTriangle,
  User,
  Lock,
  CheckCircle2,
  Building2,
  Scale,
  Sparkles,
  ArrowRight,
  Fingerprint
} from "lucide-react";

export const PRESET_ACCOUNTS = [
  {
    id: "CALA-MH-04",
    role: "lao",
    roleTitle: "Special Land Acquisition Officer (SLAO)",
    name: "Shri Rajesh Deshmukh, IAS",
    designation: "Competent Authority for Land Acquisition (CALA)",
    district: "Pune West Arc Division",
    email: "lao.pune@nic.in",
    avatarInitials: "RD",
    avatarBg: "bg-blue-600",
    badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    description: "Parcel-level valuation, Section 20(E) awards & compensation disbursal.",
    stats: "48 Active Parcels · Pune Ring Road",
    defaultPassword: "password123",
  },
  {
    id: "DC-PUN-01",
    role: "collector",
    roleTitle: "District Collector & Magistrate",
    name: "Dr. Suhas Diwase, IAS",
    designation: "Head of Revenue & Land Records",
    district: "Pune District, Maharashtra",
    email: "collector.pune@nic.in",
    avatarInitials: "SD",
    avatarBg: "bg-emerald-600",
    badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    description: "Corridor statutory approvals, Gazette notices & arbitration hearing authority.",
    stats: "Corridor Oversight · Sec 20(F) Claims",
    defaultPassword: "password123",
  },
  {
    id: "LAW-HC-88",
    role: "legal",
    roleTitle: "Senior Government Pleader",
    name: "Adv. Meera Kulkarni",
    designation: "Standing Counsel, Bombay High Court",
    district: "High Court Division Bench",
    email: "legal.kala@nic.in",
    avatarInitials: "MK",
    avatarBg: "bg-purple-600",
    badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    description: "Section 25 lapse counter-affidavits, writ stay vacations & Lok Adalat.",
    stats: "14 Writs Pending · 2 Critical Stays",
    defaultPassword: "password123",
  },
  {
    id: "CAG-AUDIT-09",
    role: "monitor",
    roleTitle: "State Vigilance & Quality Auditor",
    name: "Vikramjit Roy, IA&AS",
    designation: "Principal Director of Audit (Infrastructure)",
    district: "Prototype audit role",
    email: "auditor.kala@nic.in",
    avatarInitials: "VR",
    avatarBg: "bg-amber-600",
    badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    description: "Statewide disbursement audit, Section 25 lapsing risk & DGPS accuracy.",
    stats: "Audit Compliance · 3 Corridors",
    defaultPassword: "password123",
  },
];

export function LoginPage({ onLogin }) {
  const [officerId, setOfficerId] = useState("CALA-MH-04");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectPreset = (account) => {
    setOfficerId(account.id);
    setPassword(account.defaultPassword);
    setError("");
  };

  const handleQuickPresetLogin = async (account) => {
    setError("");
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setLoading(false);

    onLogin({
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      roleTitle: account.roleTitle,
      designation: account.designation,
      district: account.district,
      avatarInitials: account.avatarInitials,
      avatarBg: account.avatarBg,
      badgeColor: account.badgeColor,
      loginTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      rememberMe,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!officerId.trim()) {
      setError("Please enter your Officer ID or NIC Email.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 750));

    const matchedAccount = PRESET_ACCOUNTS.find(
      (a) =>
        a.id.toLowerCase() === officerId.trim().toLowerCase() ||
        a.email.toLowerCase() === officerId.trim().toLowerCase()
    );

    setLoading(false);

    if (!matchedAccount || password !== matchedAccount.defaultPassword) {
      setError("Invalid demo credentials. Select a listed officer or use the displayed demo password.");
      return;
    }

    onLogin({
      id: matchedAccount.id,
      name: matchedAccount.name,
      email: matchedAccount.email,
      role: matchedAccount.role,
      roleTitle: matchedAccount.roleTitle,
      designation: matchedAccount.designation,
      district: matchedAccount.district,
      avatarInitials: matchedAccount.avatarInitials,
      avatarBg: matchedAccount.avatarBg,
      badgeColor: matchedAccount.badgeColor,
      loginTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      rememberMe,
    });
  };

  return (
    <div className="min-h-screen bg-[#070D18] flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden selection:bg-orange-500/30">
      <div className="absolute top-[-15%] left-[-10%] w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[550px] h-[550px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      <header className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between py-2 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-[#1E3A8A] border border-blue-400/30 flex items-center justify-center text-white font-black tracking-wider shadow-lg shadow-blue-900/30">
            <span className="text-[#F97316] text-xl">B</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-extrabold text-lg tracking-tight">
                Bhoomi<span className="text-[#F97316]">IQ</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-orange-500/15 text-[#F97316] px-2 py-0.5 rounded border border-orange-500/30">
                Prototype
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Land acquisition risk intelligence prototype
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Prototype • model-assisted decision support</span>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto w-full my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/50 relative">
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-semibold tracking-wide uppercase mb-3">
                  <Fingerprint className="w-3 h-3" />
                  Demo Officer Sign-In
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Officer Authentication
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Use one of the listed demo officer accounts. This screen does not connect to a real NIC authentication service.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Officer ID / NIC Email Address
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={officerId}
                      onChange={(e) => setOfficerId(e.target.value)}
                      placeholder="e.g. CALA-MH-04 or lao.pune@nic.in"
                      className="w-full bg-slate-950/80 border border-slate-700/80 text-white placeholder:text-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Security Password
                    </label>
                    <span className="text-[11px] text-slate-500">Demo: password123</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-slate-950/80 border border-slate-700/80 text-white placeholder:text-slate-600 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400 hover:text-slate-200">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-orange-500 focus:ring-orange-500 focus:ring-offset-slate-900"
                    />
                    <span>Remember officer session</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setOfficerId("CALA-MH-04");
                      setPassword("password123");
                      setError("");
                    }}
                    className="text-[#F97316] hover:text-orange-400 font-medium transition"
                  >
                    Quick Autofill
                  </button>
                </div>

                {error && (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-3.5 py-2 text-xs text-red-400 animate-in fade-in">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#F97316] hover:bg-[#EA580C] active:scale-[0.99] text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Checking demo credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign in to prototype</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-5 pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Prototype authentication only. No government identity system or statutory audit service is connected.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/90 rounded-2xl p-6 sm:p-7 flex flex-col justify-between">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
                    Designated Officer Roles
                  </span>
                  <span className="text-[10px] text-slate-500">1-Click Fast Access</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Select a demo officer to populate the credentials, then sign in:
                </p>
              </div>

              <div className="space-y-2.5">
                {PRESET_ACCOUNTS.map((account) => {
                  const isSelected = officerId === account.id || officerId === account.email;
                  return (
                    <div
                      key={account.id}
                      onClick={() => selectPreset(account)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 group ${
                        isSelected
                          ? "bg-slate-800/90 border-[#F97316]/80 shadow-md shadow-orange-500/5 ring-1 ring-[#F97316]/50"
                          : "bg-slate-950/50 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-lg ${account.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm`}
                          >
                            {account.avatarInitials}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-white group-hover:text-[#F97316] transition-colors">
                                {account.name}
                              </h4>
                              <span className={`text-[10px] font-semibold px-2 py-0.2 rounded border ${account.badgeColor}`}>
                                {account.id}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300 font-medium">
                              {account.roleTitle}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {account.stats}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickPresetLogin(account);
                          }}
                          className="shrink-0 px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-white/5 hover:bg-[#F97316] text-slate-300 hover:text-white border border-white/10 hover:border-[#F97316] transition flex items-center gap-1"
                          title="Instant sign-in with this profile"
                        >
                          <span>Sign In</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Demo authentication · offline</span>
                </div>
                <span>v2.4 Live Build</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="relative z-10 max-w-6xl mx-auto w-full py-2 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-800/60">
        <div className="flex items-center gap-2">
          <span>Ministry of Road Transport & Highways</span>
          <span>·</span>
          <span>No government identity provider connected</span>
        </div>
        <p>Prototype UI — not an official government portal</p>
      </footer>
    </div>
  );
}

export default LoginPage;