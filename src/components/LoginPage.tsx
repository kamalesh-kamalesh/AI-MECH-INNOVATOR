import React, { useState } from 'react';
import { playClickSound } from '../utils/audio';
import { ArrowRight, Zap, AlertTriangle, User, Users, Bot, ShieldCheck } from 'lucide-react';

const mechLogo = '/src/assets/images/mech_app_logo_1787638917066.jpg';

interface LoginPageProps {
  initialTeamName: string;
  initialMember1?: string;
  initialMember2?: string;
  onStartChallenge: (teamName: string, member1: string, member2: string) => void;
  onOpenAdminLogin?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  initialTeamName,
  initialMember1 = '',
  initialMember2 = '',
  onStartChallenge,
  onOpenAdminLogin,
}) => {
  const [teamName, setTeamName] = useState(initialTeamName || '');
  const [member1, setMember1] = useState(initialMember1 || '');
  const [member2, setMember2] = useState(initialMember2 || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();

    const trimmedTeam = teamName.trim();
    if (!trimmedTeam) {
      setError('Please enter a Team Name to proceed');
      return;
    }

    setError('');
    onStartChallenge(
      trimmedTeam,
      member1.trim() || 'Engineer 1',
      member2.trim() || 'Engineer 2'
    );
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-6 font-mono">
      <div className="w-full max-w-md bg-slate-900/95 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-6 shadow-2xl backdrop-blur-md">
        {/* Header with Logo */}
        <div className="text-center space-y-2 pb-3 border-b border-slate-800">
          {/* Logo Badge Container */}
          <div className="flex justify-center">
            <div className="relative p-1 rounded-2xl bg-slate-950 border-2 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)] group hover:border-cyan-400 transition-all">
              <img
                src={mechLogo}
                alt="AI Mech Innovator Logo"
                referrerPolicy="no-referrer"
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl"
              />
              <div className="absolute -bottom-1.5 -right-1.5 p-1 bg-cyan-950 border border-cyan-400 rounded-lg">
                <Bot className="w-3.5 h-3.5 text-cyan-300" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-cyan-400 uppercase tracking-tight pt-1">
              AI MECH INNOVATOR
            </h1>
            <p className="text-sm font-bold text-cyan-300 tracking-wide">
              Design. Build. Test. Innovate.
            </p>
            <div className="pt-2">
              <span className="inline-block bg-slate-800 text-slate-300 text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                Team Registration
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Team Name */}
          <div className="space-y-1.5">
            <label className="block text-xs uppercase font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                Team Name <span className="text-cyan-400">*</span>
              </span>
              <span className="text-[10px] text-slate-500">REQUIRED</span>
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => {
                setTeamName(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              placeholder="e.g. RoboTech"
              maxLength={25}
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-slate-100 text-sm outline-none transition-all placeholder:text-slate-600 focus:ring-1 focus:ring-cyan-500/40"
              required
            />
          </div>

          {/* Member 1 */}
          <div className="space-y-1.5">
            <label className="block text-xs uppercase font-bold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              Member 1
            </label>
            <input
              type="text"
              value={member1}
              onChange={(e) => setMember1(e.target.value)}
              placeholder="Member 1 name"
              maxLength={30}
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-4 py-2.5 text-slate-100 text-sm outline-none transition-all placeholder:text-slate-600 focus:ring-1 focus:ring-amber-500/40"
            />
          </div>

          {/* Member 2 */}
          <div className="space-y-1.5">
            <label className="block text-xs uppercase font-bold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-purple-400" />
              Member 2
            </label>
            <input
              type="text"
              value={member2}
              onChange={(e) => setMember2(e.target.value)}
              placeholder="Member 2 name"
              maxLength={30}
              className="w-full bg-slate-950 border border-slate-700 focus:border-purple-400 rounded-xl px-4 py-2.5 text-slate-100 text-sm outline-none transition-all placeholder:text-slate-600 focus:ring-1 focus:ring-purple-500/40"
            />
          </div>

          {error && (
            <div className="bg-red-950/60 border border-red-500/40 p-2.5 rounded-lg flex items-center gap-2 text-xs text-red-300">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* INITIALIZE CHALLENGE button */}
          <div className="pt-3 space-y-2">
            <button
              type="submit"
              className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/25 active:scale-[0.99]"
            >
              <Zap className="w-4 h-4 fill-slate-950 shrink-0" />
              <span>INITIALIZE CHALLENGE</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            {onOpenAdminLogin && (
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onOpenAdminLogin();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Organizer Admin Portal</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

