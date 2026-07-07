import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Designation } from '../types';
import { motion } from 'motion/react';
import { LogIn, User as UserIcon, ShieldCheck, Key } from 'lucide-react';

export const EntryScreen: React.FC = () => {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState<Designation>('Teacher');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const success = await login(name, designation, code);
    if (!success) {
      setError('Invalid access code. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4 overflow-hidden relative">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-card z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-black text-primary tracking-tighter">TeachFlow</h1>
          <p className="text-slate-500 text-[10px] mt-1 font-bold uppercase tracking-[0.2em] text-center">by Escarté Learning Labs</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1.5 flex items-center gap-2">
              <UserIcon size={16} className="text-primary" /> Full Name
            </label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5 flex items-center gap-2">
              <ShieldCheck size={16} className="text-primary" /> Designation
            </label>
            <select
              className="input-field cursor-pointer"
              value={designation}
              onChange={(e) => setDesignation(e.target.value as Designation)}
            >
              <option value="Owner">Owner</option>
              <option value="Operational Head">Operational Head</option>
              <option value="General Manager">General Manager</option>
              <option value="Social Media Manager">Social Media Manager</option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5 flex items-center gap-2">
              <Key size={16} className="text-primary" /> Secret Access Code
            </label>
            <input
              type="password"
              required
              className="input-field"
              placeholder="••••••••"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-red-500 text-sm font-medium"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full h-11 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Enter App'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-muted-foreground italic">
          Designed for high-performance educational institutes.
        </p>
      </motion.div>
    </div>
  );
};
