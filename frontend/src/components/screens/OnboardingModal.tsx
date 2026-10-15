import React, { useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  GraduationCap,
  Lock,
  Search,
  Shield,
  ShieldCheck,
  X,
} from "lucide-react";
import { useUIStore } from "../../store/uiStore";

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, setUserProfile } = useUIStore();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(2); // Start at Academic Profile (Screen 1) or Step 1
  const [ageBracket, setAgeBracket] = useState<"under18" | "adult">("adult");
  const [username, setUsername] = useState("@Aarav_Study");
  const [selectedUniv, setSelectedUniv] = useState("Delhi University (DU)");
  const [degree, setDegree] = useState("B.Tech / B.E. (Engineering)");
  const [specialization, setSpecialization] = useState("Computer Science & Engineering");
  const [selectedSem, setSelectedSem] = useState<number>(4);
  const [rollId, setRollId] = useState("");
  const [parentContact, setParentContact] = useState("parent.name@example.com");
  const [verificationMethod, setVerificationMethod] = useState<"magic_link" | "sms_otp" | "slip">("magic_link");

  // Step 4: Privacy Toggles
  const [cloudSync, setCloudSync] = useState(false);
  const [networkDiagnostics, setNetworkDiagnostics] = useState(false);
  const [aiImprovement, setAiImprovement] = useState(false);

  if (!isOnboardingOpen) return null;

  const handleFinish = () => {
    setUserProfile({
      username: username.trim() || (ageBracket === "under18" ? "Aarav (Minor)" : "Aarav"),
      isMinor: ageBracket === "under18",
      isGuest: false,
    });
    setIsOnboardingOpen(false);
  };

  const handleGuest = () => {
    setUserProfile({
      username: "Guest Learner",
      isMinor: false,
      isGuest: true,
    });
    setIsOnboardingOpen(false);
  };

  const frequentInstitutions = [
    "Delhi University (DU)",
    "Anna University",
    "Mumbai University (MU)",
    "VTU Karnataka",
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-academic-slate-800 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-2xl max-w-5xl w-full flex flex-col md:flex-row overflow-hidden my-4 max-h-[92vh]">
        {/* Left Sidebar: Progress Roadmap (Stitch Spec from Screen 1 & 3) */}
        <div className="w-full md:w-64 bg-academic-slate-50 dark:bg-academic-slate-900 p-6 border-b md:border-b-0 md:border-r border-academic-slate-200 dark:border-academic-slate-700 flex flex-col justify-between space-y-6 flex-shrink-0">
          <div className="space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="bg-academic-primary text-white p-2 rounded-xl">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-academic-slate-900 dark:text-academic-slate-100 text-label-md">
                  Siksha OpenLearn
                </div>
                <div className="text-label-sm text-academic-slate-400">Learner Onboarding</div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-label-sm font-bold uppercase tracking-wider text-academic-slate-400 mb-2">
                Progress Roadmap
              </div>

              {/* Step 1 */}
              <div
                onClick={() => setStep(1)}
                className={`p-2.5 rounded-xl flex items-center justify-between text-label-sm font-semibold cursor-pointer transition ${
                  step === 1
                    ? "bg-blue-100/70 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                    : "text-academic-slate-600 dark:text-academic-slate-400 hover:bg-academic-slate-100 dark:hover:bg-academic-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                  <span>1. Welcome &amp; Locale</span>
                </div>
              </div>

              {/* Step 2 */}
              <div
                onClick={() => setStep(2)}
                className={`p-2.5 rounded-xl flex items-center justify-between text-label-sm font-semibold cursor-pointer transition ${
                  step === 2
                    ? "bg-blue-100/70 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                    : "text-academic-slate-600 dark:text-academic-slate-400 hover:bg-academic-slate-100 dark:hover:bg-academic-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-academic-primary text-white flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span>2. Academic Profile</span>
                </div>
              </div>

              {/* Step 3 (Parental Consent if minor, or Privacy) */}
              <div
                onClick={() => setStep(3)}
                className={`p-2.5 rounded-xl flex items-center justify-between text-label-sm font-semibold cursor-pointer transition ${
                  step === 3
                    ? "bg-blue-100/70 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                    : "text-academic-slate-600 dark:text-academic-slate-400 hover:bg-academic-slate-100 dark:hover:bg-academic-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full border border-academic-slate-300 dark:border-academic-slate-600 flex items-center justify-center text-[10px]">
                    3
                  </span>
                  <span>3. Parental Consent</span>
                </div>
              </div>

              {/* Step 4 */}
              <div
                onClick={() => setStep(4)}
                className={`p-2.5 rounded-xl flex items-center justify-between text-label-sm font-semibold cursor-pointer transition ${
                  step === 4
                    ? "bg-blue-100/70 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                    : "text-academic-slate-600 dark:text-academic-slate-400 hover:bg-academic-slate-100 dark:hover:bg-academic-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full border border-academic-slate-300 dark:border-academic-slate-600 flex items-center justify-center text-[10px]">
                    <Lock className="w-2.5 h-2.5" />
                  </span>
                  <span>4. Data Privacy</span>
                </div>
              </div>

              {/* Step 5 */}
              <div
                onClick={() => setStep(5)}
                className={`p-2.5 rounded-xl flex items-center justify-between text-label-sm font-semibold cursor-pointer transition ${
                  step === 5
                    ? "bg-blue-100/70 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                    : "text-academic-slate-600 dark:text-academic-slate-400 hover:bg-academic-slate-100 dark:hover:bg-academic-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full border border-academic-slate-300 dark:border-academic-slate-600 flex items-center justify-center text-[10px]">
                    5
                  </span>
                  <span>5. Readiness Check</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-white dark:bg-academic-slate-800 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700 text-body-sm space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-label-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-Tracker Guarantee</span>
            </div>
            <p className="text-academic-slate-500 text-label-sm leading-tight">
              Siksha stores preferences on local storage and open sovereign nodes only.
            </p>
          </div>
        </div>

        {/* Center / Right Content View */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          {/* Top Header Strip */}
          <div className="flex items-center justify-between border-b border-academic-slate-200 dark:border-academic-slate-700 pb-3">
            <div className="flex items-center gap-2 text-label-sm font-semibold text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Designed to support GDPR &amp; DPDP Act requirements &bull; Zero Third-Party Trackers</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOnboardingOpen(false)}
              className="p-1 rounded-xl text-academic-slate-400 hover:text-academic-slate-700 dark:hover:text-academic-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SCREEN 1: Step 1 (Welcome & Account Creation) */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn max-w-xl">
              <div>
                <h3 className="text-headline-lg font-bold text-academic-slate-900 dark:text-academic-slate-50">
                  Create your private study profile
                </h3>
                <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400 mt-1">
                  No phone numbers, no tracking cookies, no biometric data collected.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-label-md font-semibold text-academic-slate-700 dark:text-academic-slate-300 mb-1">
                    Email or Anonymous Username (Self-selected)
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. arjun_study or arjun@example.org"
                    className="w-full px-4 py-2.5 rounded-xl border border-academic-slate-300 dark:border-academic-slate-600 bg-academic-slate-50 dark:bg-academic-slate-900 text-body-md"
                  />
                </div>

                <div>
                  <label className="block text-label-md font-semibold text-academic-slate-700 dark:text-academic-slate-300 mb-2">
                    Your Age Bracket &bull; Statutory Compliance
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAgeBracket("under18")}
                      className={`p-3.5 rounded-2xl border text-left transition ${
                        ageBracket === "under18"
                          ? "bg-blue-50 dark:bg-blue-950/60 border-academic-primary shadow-sm"
                          : "bg-academic-slate-50 dark:bg-academic-slate-900 border-academic-slate-300"
                      }`}
                    >
                      <div className="text-label-md font-bold">Under 18</div>
                      <div className="text-label-sm text-academic-slate-500">Minor Learner</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAgeBracket("adult")}
                      className={`p-3.5 rounded-2xl border text-left transition ${
                        ageBracket === "adult"
                          ? "bg-blue-50 dark:bg-blue-950/60 border-academic-primary shadow-sm"
                          : "bg-academic-slate-50 dark:bg-academic-slate-900 border-academic-slate-300"
                      }`}
                    >
                      <div className="text-label-md font-bold">18 or older</div>
                      <div className="text-label-sm text-academic-slate-500">Adult Learner</div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleGuest}
                  className="px-4 py-2 text-label-sm font-semibold text-academic-slate-500"
                >
                  Explore as Guest
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 bg-academic-primary text-white font-semibold text-label-md rounded-xl hover:bg-academic-primary-hover shadow-sm flex items-center gap-2"
                >
                  <span>Continue to Academic Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 2: Step 2 (Academic Profile - Stitch Image 1) */}
          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
              <div className="lg:col-span-2 space-y-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-label-sm font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      CURRICULUM SYNCHRONIZATION &bull; Self-Paced &amp; Configurable
                    </span>
                  </div>
                  <h3 className="text-headline-lg font-bold text-academic-slate-900 dark:text-academic-slate-50 mt-1">
                    Academic Profile
                  </h3>
                  <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
                    Align open syllabus notes, question banks, and past exam blueprints directly with your syllabus. Every parameter is modifiable or skippable whenever you choose.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Jurisdiction & University */}
                  <div>
                    <label className="block text-label-md font-bold text-academic-slate-900 dark:text-academic-slate-100 mb-1">
                      Jurisdiction &amp; University *
                    </label>
                    <p className="text-label-sm text-academic-slate-500 mb-2">
                      Used to map statutory credit matrices and semester exam calendars.
                    </p>
                    <select
                      className="w-full p-2.5 rounded-xl border border-academic-slate-300 dark:border-academic-slate-600 bg-academic-slate-50 dark:bg-academic-slate-900 text-body-md mb-2"
                    >
                      <option>India (UGC, AICTE, State Boards)</option>
                    </select>

                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-academic-slate-400" />
                      <input
                        type="text"
                        value={selectedUniv}
                        onChange={(e) => setSelectedUniv(e.target.value)}
                        placeholder="Search Affiliated University / College"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-academic-slate-300 dark:border-academic-slate-600 bg-academic-slate-50 dark:bg-academic-slate-900 text-body-md"
                      />
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {frequentInstitutions.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setSelectedUniv(item)}
                          className={`px-2.5 py-1 rounded-lg text-label-sm border transition ${
                            selectedUniv === item
                              ? "bg-academic-primary text-white border-academic-primary font-bold shadow-sm"
                              : "bg-academic-slate-100 dark:bg-academic-slate-700 text-academic-slate-700 dark:text-academic-slate-300 border-academic-slate-200"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Program & Academic Level */}
                  <div>
                    <label className="block text-label-md font-bold text-academic-slate-900 dark:text-academic-slate-100 mb-1">
                      Program &amp; Academic Level
                    </label>
                    <div className="grid grid-cols-2 gap-3 mb-2">
                      <select
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        className="p-2.5 rounded-xl border border-academic-slate-300 dark:border-academic-slate-600 bg-academic-slate-50 dark:bg-academic-slate-900 text-body-sm"
                      >
                        <option>B.Tech / B.E. (Engineering)</option>
                        <option>BCA (Computer Applications)</option>
                        <option>B.Sc Natural Sciences</option>
                      </select>
                      <select
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        className="p-2.5 rounded-xl border border-academic-slate-300 dark:border-academic-slate-600 bg-academic-slate-50 dark:bg-academic-slate-900 text-body-sm"
                      >
                        <option>Computer Science &amp; Engineering</option>
                        <option>Information Technology</option>
                        <option>Electronics &amp; Communication</option>
                      </select>
                    </div>

                    {/* Semester Pills */}
                    <div className="space-y-1">
                      <div className="text-label-sm font-semibold text-academic-slate-500">
                        Current Standing / Active Semester:
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSelectedSem(s)}
                            className={`py-1.5 rounded-lg text-label-sm font-bold border transition ${
                              selectedSem === s
                                ? "bg-academic-primary text-white border-academic-primary shadow-sm"
                                : "bg-academic-slate-100 dark:bg-academic-slate-700 text-academic-slate-700 dark:text-academic-slate-300 border-academic-slate-200"
                            }`}
                          >
                            Sem {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Institutional Roll ID (Optional) */}
                  <div className="p-4 bg-academic-slate-50 dark:bg-academic-slate-900/60 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="roll-id-input" className="text-label-md font-bold text-academic-slate-800 dark:text-academic-slate-200">
                        Institutional Roll or Enrollment ID <span className="font-normal text-academic-slate-400">(Optional)</span>
                      </label>
                      <span className="text-label-sm font-mono text-emerald-600 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Encrypted &amp; Salted</span>
                      </span>
                    </div>
                    <input
                      id="roll-id-input"
                      type="text"
                      value={rollId}
                      onChange={(e) => setRollId(e.target.value)}
                      placeholder="e.g. 21CS0892 or leave blank"
                      className="w-full px-3.5 py-2 rounded-xl border border-academic-slate-300 dark:border-academic-slate-600 bg-white dark:bg-academic-slate-800 text-body-sm"
                    />
                    <p className="text-label-sm text-academic-slate-500">
                      If left unpopulated, you will still enjoy full, unhindered access to all learning paths and materials.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="text-label-sm font-semibold text-academic-slate-500 hover:underline"
                  >
                    &gt;&gt; Skip Academic Setup for Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(ageBracket === "under18" ? 3 : 4)}
                    className="px-6 py-2.5 bg-academic-primary text-white font-semibold text-label-md rounded-xl hover:bg-academic-primary-hover shadow-sm transition flex items-center gap-2"
                  >
                    <span>Save &amp; Continue (Step 3)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Curated Match Preview Card (Right Column from Image 1) */}
              <div className="space-y-4">
                <div className="bg-academic-slate-50 dark:bg-academic-slate-900 rounded-3xl p-5 border border-academic-slate-200 dark:border-academic-slate-700 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between text-label-sm">
                    <span className="font-bold uppercase tracking-wider text-academic-slate-500">
                      Curated Match Preview
                    </span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      &bull; Sync Active
                    </span>
                  </div>

                  <div className="bg-academic-slate-900 text-white rounded-2xl p-4 space-y-1">
                    <div className="text-label-sm text-academic-slate-400">CONNECTED DATABASE:</div>
                    <div className="font-bold text-headline-sm">{selectedUniv} - CSE</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-label-sm font-bold text-academic-slate-700 dark:text-academic-slate-300">
                      Ready Modules for Your Profile:
                    </div>
                    <div className="p-2.5 bg-white dark:bg-academic-slate-800 rounded-xl border border-academic-slate-200 dark:border-academic-slate-700 text-body-sm flex justify-between">
                      <span>Algorithms &amp; Complexity</span>
                      <span className="font-mono font-bold text-academic-primary">Sem 4</span>
                    </div>
                    <div className="p-2.5 bg-white dark:bg-academic-slate-800 rounded-xl border border-academic-slate-200 dark:border-academic-slate-700 text-body-sm flex justify-between">
                      <span>Operating Systems Architecture</span>
                      <span className="font-mono font-bold text-academic-primary">Sem 4</span>
                    </div>
                    <div className="p-2.5 bg-white dark:bg-academic-slate-800 rounded-xl border border-academic-slate-200 dark:border-academic-slate-700 text-body-sm flex justify-between">
                      <span>Database Management Systems</span>
                      <span className="font-mono font-bold text-academic-primary">Sem 4</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-academic-slate-200 dark:border-academic-slate-700 flex items-center justify-between text-body-sm">
                    <span className="text-academic-slate-500">Archived Question Papers:</span>
                    <span className="font-bold text-academic-primary text-headline-sm">142 Sets</span>
                  </div>
                </div>

                {/* Academic Integrity Compact */}
                <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 text-body-sm text-emerald-900 dark:text-emerald-200 space-y-2">
                  <div className="font-bold text-label-md flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Academic Integrity Compact</span>
                  </div>
                  <ul className="text-label-sm space-y-1 list-disc pl-4 text-emerald-800 dark:text-emerald-300">
                    <li>No GPA, attendance, or ranking tracking</li>
                    <li>Fully offline-accessible offline SQLite export</li>
                    <li>Change or erase your university affiliation anytime</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 3: Step 3 (Parental Consent - Stitch Image 2) */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn max-w-2xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-label-sm font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    DPDP Act Sec 9 &bull; GDPR Art 8 Framework (Legal Review Pending)
                  </span>
                </div>
                <h3 className="text-headline-lg font-bold text-academic-slate-900 dark:text-academic-slate-50 mt-1">
                  Parent &amp; Guardian Consent
                </h3>
              </div>

              <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-body-sm text-emerald-900 dark:text-emerald-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Strict Privacy Assurance</span>
                </div>
                <p>
                  We never profile minors, run targeted ads, or share private learning milestones. Your academic journey remains private and secure.
                </p>
              </div>

              <div className="p-4 bg-academic-slate-50 dark:bg-academic-slate-900 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700 flex items-center justify-between">
                <div>
                  <div className="text-label-sm text-academic-slate-500">CONFIGURED PROFILE</div>
                  <div className="font-bold text-headline-sm">{username}</div>
                </div>
                <span className="px-3 py-1 rounded-full text-label-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  Minor (16-17)
                </span>
              </div>

              <div>
                <label className="block text-label-md font-bold text-academic-slate-900 dark:text-academic-slate-100 mb-1">
                  Parent or Guardian Email / Phone
                </label>
                <input
                  type="text"
                  value={parentContact}
                  onChange={(e) => setParentContact(e.target.value)}
                  placeholder="parent.name@example.com or mobile"
                  className="w-full px-4 py-2.5 rounded-xl border border-academic-slate-300 dark:border-academic-slate-600 bg-white dark:bg-academic-slate-900 text-body-md"
                />
              </div>

              {/* What Gets Shared Safe Guarantee */}
              <div className="space-y-2">
                <div className="text-label-sm font-bold uppercase tracking-wider text-academic-slate-500">
                  What Gets Shared? &bull; Safe Guarantee
                </div>
                <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800 text-body-sm flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>What guardians can see:</strong> Confirmation that you are actively learning open college curricula on Siksha OpenLearn.
                  </div>
                </div>
                <div className="p-3 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl border border-rose-200 dark:border-rose-800 text-body-sm flex items-start gap-2.5">
                  <X className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>What we never disclose:</strong> Personal study notes, peer study queries, quiz errors, or reading search history.
                  </div>
                </div>
                <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800 text-body-sm flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Zero behavioral tracking:</strong> Strictly preserved under DPDP Act Section 9. No predictive profiling.
                  </div>
                </div>
              </div>

              {/* Verification Method Chips */}
              <div className="space-y-2">
                <div className="text-label-sm font-bold text-academic-slate-700 dark:text-academic-slate-300">
                  Choose Verification Method:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setVerificationMethod("magic_link")}
                    className={`p-3 rounded-xl border text-left text-body-sm transition ${
                      verificationMethod === "magic_link"
                        ? "bg-blue-50 border-academic-primary font-bold shadow-sm"
                        : "bg-academic-slate-50 dark:bg-academic-slate-900 border-academic-slate-200"
                    }`}
                  >
                    Direct Magic Link via Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerificationMethod("sms_otp")}
                    className={`p-3 rounded-xl border text-left text-body-sm transition ${
                      verificationMethod === "sms_otp"
                        ? "bg-blue-50 border-academic-primary font-bold shadow-sm"
                        : "bg-academic-slate-50 dark:bg-academic-slate-900 border-academic-slate-200"
                    }`}
                  >
                    SMS OTP (Govt ID Not Required)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerificationMethod("slip")}
                    className={`p-3 rounded-xl border text-left text-body-sm transition ${
                      verificationMethod === "slip"
                        ? "bg-blue-50 border-academic-primary font-bold shadow-sm"
                        : "bg-academic-slate-50 dark:bg-academic-slate-900 border-academic-slate-200"
                    }`}
                  >
                    Offline School Slip
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-label-sm font-semibold text-academic-slate-500 hover:underline"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 bg-academic-primary text-white font-semibold text-label-md rounded-xl hover:bg-academic-primary-hover shadow-sm transition flex items-center gap-2"
                >
                  <span>Send Permission Request &amp; Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 4: Step 4 ("Your Data, Your Sovereign Choice" - Stitch Image 3) */}
          {step === 4 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
              <div className="lg:col-span-2 space-y-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-label-sm font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      STEP 3 OF 4: PRIVACY &amp; DATA CONSENTS &bull; DPDP ACT 2023 &amp; GDPR ART 7
                    </span>
                  </div>
                  <h3 className="text-headline-lg font-bold text-academic-slate-900 dark:text-academic-slate-50 mt-1">
                    Your Data, Your Sovereign Choice
                  </h3>
                  <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
                    We never pre-tick boxes, use manipulative countdowns, or force consent for core features. Every consent is granular, optional, and revocable anytime in Settings.
                  </p>
                </div>

                {/* Three Posture Badges */}
                <div className="grid grid-cols-3 gap-2 text-center text-body-sm">
                  <div className="p-3 bg-academic-slate-50 dark:bg-academic-slate-900 rounded-xl border border-academic-slate-200 dark:border-academic-slate-700">
                    <div className="text-label-sm text-academic-slate-400 uppercase">Default Posture</div>
                    <div className="font-bold text-academic-slate-900 dark:text-academic-slate-100">100% Opt-In Only</div>
                  </div>
                  <div className="p-3 bg-academic-slate-50 dark:bg-academic-slate-900 rounded-xl border border-academic-slate-200 dark:border-academic-slate-700">
                    <div className="text-label-sm text-academic-slate-400 uppercase">Data Localization</div>
                    <div className="font-bold text-academic-slate-900 dark:text-academic-slate-100">Sovereign On-Device</div>
                  </div>
                  <div className="p-3 bg-academic-slate-50 dark:bg-academic-slate-900 rounded-xl border border-academic-slate-200 dark:border-academic-slate-700">
                    <div className="text-label-sm text-academic-slate-400 uppercase">Third-Party Brokers</div>
                    <div className="font-bold text-academic-slate-900 dark:text-academic-slate-100">Strict Zero Policy</div>
                  </div>
                </div>

                {/* 4 Granular Toggles (Stitch Image 3 Spec) */}
                <div className="space-y-3">
                  {/* Toggle 1: Essential Local Storage */}
                  <div className="p-4 bg-academic-slate-50 dark:bg-academic-slate-900/60 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-headline-sm">Local device session &amp; progress</span>
                        <span className="px-2 py-0.5 rounded text-label-sm font-semibold bg-blue-100 text-blue-800">
                          Strictly Essential
                        </span>
                      </div>
                      <div className="text-label-sm text-academic-slate-500">
                        Legal Basis: Legitimate Technical Necessity (GDPR Art 6(1)(f))
                      </div>
                      <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
                        Stores your active semester roadmap, unit notes, and downloaded syllabus bookmarks in your browser's indexed local storage.
                      </p>
                    </div>
                    <span className="font-bold text-label-sm text-emerald-600">ACTIVE (ON)</span>
                  </div>

                  {/* Toggle 2: Cloud Sync */}
                  <div className="p-4 bg-white dark:bg-academic-slate-800 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="font-bold text-headline-sm">Multi-device cloud synchronization</div>
                      <div className="text-label-sm text-academic-slate-500">Optional Cross-Terminal Relay</div>
                      <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
                        Securely sync between mobile and cyber cafe desktop using End-to-End Encrypted zero-knowledge storage.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCloudSync(!cloudSync)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        cloudSync ? "bg-academic-primary" : "bg-academic-slate-300 dark:bg-academic-slate-600"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          cloudSync ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Toggle 3: Low-Bandwidth Diagnostics */}
                  <div className="p-4 bg-white dark:bg-academic-slate-800 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="font-bold text-headline-sm">Low-bandwidth network diagnostics</div>
                      <div className="text-label-sm text-academic-slate-500">Anonymous Rural Connection Telemetry</div>
                      <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
                        Helps our non-profit engineers detect when 2G/3G connections fail during mock tests. Sanitized via Differential Privacy.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNetworkDiagnostics(!networkDiagnostics)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        networkDiagnostics ? "bg-academic-primary" : "bg-academic-slate-300 dark:bg-academic-slate-600"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          networkDiagnostics ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Toggle 4: AI Tutor Model Contribution */}
                  <div className="p-4 bg-white dark:bg-academic-slate-800 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-headline-sm">Contribute anonymized study questions to improve AI tutors</span>
                        <span className="px-2 py-0.5 rounded text-label-sm font-semibold bg-purple-100 text-purple-800">
                          SEPARATE &amp; INDEPENDENT CHOICE
                        </span>
                      </div>
                      <p className="text-body-sm text-academic-slate-600 dark:text-academic-slate-400">
                        Allow non-personal academic questions to help train open multilingual education weights (like Indic-Llama).
                      </p>
                      <div className="text-label-sm text-emerald-700 font-semibold pt-1">
                        Non-Degradation Guarantee: Leaving this OFF will NOT degrade your AI Study Assistant experience.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAiImprovement(!aiImprovement)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        aiImprovement ? "bg-academic-primary" : "bg-academic-slate-300 dark:bg-academic-slate-600"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          aiImprovement ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleFinish}
                    className="px-4 py-2 text-label-sm font-semibold text-academic-slate-600 dark:text-academic-slate-400 hover:underline"
                  >
                    Continue with Zero Optional Consents
                  </button>
                  <button
                    type="button"
                    onClick={handleFinish}
                    className="px-6 py-2.5 bg-academic-primary text-white font-semibold text-label-md rounded-xl hover:bg-academic-primary-hover shadow-sm transition flex items-center gap-2"
                  >
                    <span>Accept Selected Only</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Column: Statutory Rights & Independent Audit Certificate (Stitch Image 3) */}
              <div className="space-y-4">
                <div className="bg-academic-slate-50 dark:bg-academic-slate-900 rounded-3xl p-5 border border-academic-slate-200 dark:border-academic-slate-700 space-y-3">
                  <div className="font-bold text-headline-sm flex items-center gap-1.5 text-academic-slate-900 dark:text-academic-slate-100">
                    <Shield className="w-4 h-4 text-academic-primary" />
                    <span>Your Statutory Rights</span>
                  </div>
                  <p className="text-label-sm text-academic-slate-500">
                    Under both DPDP Act (India) and GDPR (EU), you retain full sovereign ownership over everything you create:
                  </p>
                  <div className="space-y-2 text-body-sm">
                    <div className="p-2.5 bg-white dark:bg-academic-slate-800 rounded-xl border border-academic-slate-200 dark:border-academic-slate-700">
                      <strong>One-Click Revocation:</strong> Withdraw consent anytime via Profile tab.
                    </div>
                    <div className="p-2.5 bg-white dark:bg-academic-slate-800 rounded-xl border border-academic-slate-200 dark:border-academic-slate-700">
                      <strong>Full Data Portability:</strong> Export notes and logs in open JSON &amp; PDF.
                    </div>
                    <div className="p-2.5 bg-white dark:bg-academic-slate-800 rounded-xl border border-academic-slate-200 dark:border-academic-slate-700">
                      <strong>Right to Erasure:</strong> Purge profile completely from device in seconds.
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-academic-slate-800 rounded-2xl border border-academic-slate-200 dark:border-academic-slate-700 space-y-2 text-body-sm">
                  <div className="font-bold flex items-center gap-1.5 text-label-md">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Independent Audit Certificate</span>
                  </div>
                  <p className="text-label-sm text-academic-slate-500">
                    Zero telemetry SDKs from commercial ad networks are included.
                  </p>
                  <div className="text-label-sm font-mono text-academic-slate-600 dark:text-academic-slate-400">
                    Audit Hash: #09F4-A28D &bull; <span className="text-academic-primary underline cursor-pointer">Verify Signature</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 5: Step 5 (Readiness Check) */}
          {step === 5 && (
            <div className="space-y-6 animate-fadeIn max-w-xl text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-3xl mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-headline-lg font-bold">Profile Ready &amp; Verified</h3>
                <p className="text-body-md text-academic-slate-600 dark:text-academic-slate-400">
                  Your academic specialization, offline cache bundle, and sovereign privacy preferences have been established.
                </p>
              </div>
              <button
                type="button"
                onClick={handleFinish}
                className="px-8 py-3 bg-academic-primary text-white font-semibold text-label-md rounded-xl hover:bg-academic-primary-hover shadow-structural"
              >
                Launch Workspace
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
