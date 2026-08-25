import React, { useState } from 'react';
import { playClickSound } from '../../utils/audio';
import { ShieldCheck, Lock, User, Key, ArrowRight, AlertTriangle, Cpu } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onCancel }) => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();

    if (!adminId.trim()) {
      setError('Please enter Admin ID');
      return;
    }

    if (password === 'P@ttu' || password === 'aimech2026' || password === 'admin') {
      setError('');
      onLoginSuccess();
    } else {
      setError('Invalid passcode! Access denied.');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-6 font-mono">
      <div className="w-full max-w-md bg-slate-900/95 border-2 border-purple-500/50 rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_0_35px_rgba(147,51,234,0.25)] backdrop-blur-md">
        {/* Header */}
        <div className="text-center space-y-2 pb-4 border-b border-slate-800">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-purple-950 border border-purple-500/40 text-purple-300 shadow-md mb-1">
            <ShieldCheck className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-[10px] font-bold uppercase tracking-widest mb-1">
              <Lock className="w-3 h-3 text-purple-400" />
              <span>ORGANIZER PORTAL</span>
            </div>
            <h1 className="text-2xl font-black text-slate-100 uppercase tracking-tight">
              ADMIN CONTROL LOGIN
            </h1>
            <p className="text-xs text-slate-400">
              AI Mech Innovator — ROBOVERSE Round 1
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs uppercase font-bold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-purple-400" />
              Admin ID
            </label>
            <input
              type="text"
              value={adminId}
              onChange={(e) => {
                setAdminId(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. ADMIN-01"
              className="w-full bg-slate-950 border border-slate-800 focus:border-purple-400 rounded-xl px-4 py-2.5 text-slate-100 text-sm outline-none transition-all placeholder:text-slate-600 focus:ring-1 focus:ring-purple-500/40"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs uppercase font-bold text-slate-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-purple-400" />
              Passcode
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter passcode"
              className="w-full bg-slate-950 border border-slate-800 focus:border-purple-400 rounded-xl px-4 py-2.5 text-slate-100 text-sm outline-none transition-all placeholder:text-slate-600 focus:ring-1 focus:ring-purple-500/40"
              required
            />
          </div>

          {error && (
            <div className="bg-red-950/60 border border-red-500/40 p-2.5 rounded-lg flex items-center gap-2 text-xs text-red-300">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-purple-600/30 active:scale-[0.99]"
            >
              <Cpu className="w-4 h-4 text-purple-200" />
              <span>AUTHENTICATE ADMIN</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                onCancel();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase transition-colors"
            >
              Back to Player Interface
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-slate-800 text-[11px] text-slate-500">
          Authorized Organizer Access Only
        </div>
      </div>
    </div>
  );
};
