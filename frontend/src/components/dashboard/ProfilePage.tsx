import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Save,
  Shield,
  User,
} from "lucide-react";
import { useUIStore } from "../../store/uiStore";

export const ProfilePage: React.FC = () => {
  const { userProfile, setUserProfile } = useUIStore();

  const [username, setUsername] = useState(userProfile?.username || "Learner");
  const [email, setEmail] = useState(userProfile?.email || "student@siksha.edu");
  const [university, setUniversity] = useState("University of Delhi");
  const [program, setProgram] = useState("B.Sc. (Hons) Computer Science");
  const [term, setTerm] = useState("Semester 4 (Distributed Systems)");
  const [defaultHours, setDefaultHours] = useState("3.5");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile({
      username,
      email,
      isMinor: userProfile?.isMinor || false,
      isGuest: false,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white dark:bg-academic-slate-800 rounded-3xl p-6 sm:p-8 border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-label-sm font-semibold text-academic-primary">
            <User className="w-4 h-4" />
            <span>Academic Profile &bull; Personal Configuration</span>
          </div>
          <h1 className="text-headline-lg font-bold text-academic-slate-900 dark:text-academic-slate-50 mt-1">
            Student Profile &amp; Preferences
          </h1>
          <p className="text-body-md text-academic-slate-600 dark:text-academic-slate-300 mt-1">
            Configure your university enrolment, default study pacing, and target examination sessions.
          </p>
        </div>

        <Link
          to="/dashboard/privacy"
          className="min-h-touch px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-semibold text-label-md rounded-xl hover:bg-emerald-100 transition flex items-center gap-2 flex-shrink-0"
        >
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>Privacy &amp; Data Rights</span>
        </Link>
      </div>

      {savedSuccess && (
        <div
          role="status"
          className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-body-md flex items-center gap-3 animate-fadeIn"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Academic preferences updated successfully.</span>
        </div>
      )}

      {/* Profile Form */}
      <form
        onSubmit={handleSave}
        className="bg-white dark:bg-academic-slate-800 p-6 sm:p-8 rounded-3xl border border-academic-slate-200 dark:border-academic-slate-700 shadow-structural space-y-6"
      >
        <div className="space-y-4">
          <h2 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-50 border-b border-academic-slate-200 dark:border-academic-slate-700 pb-3">
            Identity &amp; Credentials
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="profile-username"
                className="block text-label-sm font-semibold text-academic-slate-700 dark:text-academic-slate-300 mb-1"
              >
                Display Name
              </label>
              <input
                id="profile-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-academic-slate-300 dark:border-academic-slate-600 bg-academic-slate-50 dark:bg-academic-slate-900 text-body-md focus:ring-2 focus:ring-academic-primary outline-none transition"
              />
            </div>

            <div>
              <label
                htmlFor="profile-email"
                className="block text-label-sm font-semibold text-academic-slate-700 dark:text-academic-slate-300 mb-1"
              >
                Registered Email
              </label>
              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-academic-slate-300 dark:border-academic-slate-600 bg-academic-slate-50 dark:bg-academic-slate-900 text-body-md focus:ring-2 focus:ring-academic-primary outline-none transition"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h2 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-50 border-b border-academic-slate-200 dark:border-academic-slate-700 pb-3">
            Academic Affiliation
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="profile-uni"
                className="block text-label-sm font-semibold text-academic-slate-700 dark:text-academic-slate-300 mb-1"
              >
                University
              </label>
              <select
                id="profile-uni"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-academic-slate-300 dark:border-academic-slate-600 bg-academic-slate-50 dark:bg-academic-slate-900 text-body-md focus:ring-2 focus:ring-academic-primary outline-none transition"
              >
                <option value="University of Delhi">University of Delhi</option>
                <option value="Anna University">Anna University</option>
                <option value="Mumbai University">Mumbai University</option>
                <option value="VTU Karnataka">VTU Karnataka</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="profile-program"
                className="block text-label-sm font-semibold text-academic-slate-700 dark:text-academic-slate-300 mb-1"
              >
                Academic Program
              </label>
              <select
                id="profile-program"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-academic-slate-300 dark:border-academic-slate-600 bg-academic-slate-50 dark:bg-academic-slate-900 text-body-md focus:ring-2 focus:ring-academic-primary outline-none transition"
              >
                <option value="B.Sc. (Hons) Computer Science">B.Sc. (Hons) Computer Science</option>
                <option value="B.Tech Computer Science & Engineering">B.Tech Computer Science &amp; Eng.</option>
                <option value="MCA / M.Sc. Informatics">MCA / M.Sc. Informatics</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="profile-term"
                className="block text-label-sm font-semibold text-academic-slate-700 dark:text-academic-slate-300 mb-1"
              >
                Active Target Syllabus
              </label>
              <select
                id="profile-term"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-academic-slate-300 dark:border-academic-slate-600 bg-academic-slate-50 dark:bg-academic-slate-900 text-body-md focus:ring-2 focus:ring-academic-primary outline-none transition"
              >
                <option value="Semester 4 (Distributed Systems)">CS-204 Distributed Systems (2024)</option>
                <option value="Semester 3 (Operating Systems)">CS-201 Operating Systems</option>
                <option value="Semester 5 (Database Internals)">CS-301 Database Internals</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h2 className="text-headline-sm font-bold text-academic-slate-900 dark:text-academic-slate-50 border-b border-academic-slate-200 dark:border-academic-slate-700 pb-3">
            Default Study Pacing
          </h2>

          <div className="max-w-xs">
            <label
              htmlFor="profile-hours"
              className="block text-label-sm font-semibold text-academic-slate-700 dark:text-academic-slate-300 mb-1"
            >
              Default Hours / Day
            </label>
            <input
              id="profile-hours"
              type="number"
              step="0.5"
              min="1"
              max="12"
              value={defaultHours}
              onChange={(e) => setDefaultHours(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-academic-slate-300 dark:border-academic-slate-600 bg-academic-slate-50 dark:bg-academic-slate-900 text-body-md focus:ring-2 focus:ring-academic-primary outline-none transition font-mono"
            />
            <span className="text-[12px] text-academic-slate-500">
              Used as initial baseline in 0/1 knapsack planner
            </span>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="min-h-touch px-6 py-2.5 bg-academic-primary text-white font-semibold text-label-md rounded-xl hover:bg-academic-primary-hover shadow-sm transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
