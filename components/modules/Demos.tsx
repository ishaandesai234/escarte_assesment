import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, where, addDoc } from 'firebase/firestore';
import { Demo, Enquiry } from '../../types';
import { Plus, GraduationCap, Clock, CheckCircle, XCircle, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export const Demos: React.FC = () => {
  const [demos, setDemos] = useState<Demo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'demos'), (snap) => {
      setDemos(snap.docs.map(d => ({ ...d.data(), id: d.id } as Demo)));
      setLoading(false);
    });
    return unsub;
  }, []);

  const getStatusColor = (outcome: string) => {
    switch (outcome) {
      case 'converted': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'not interested': return 'text-red-600 bg-red-50 border-red-200';
      case 'follow-up': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-secondary" size={40} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary text-display">Demo Management</h1>
          <p className="text-muted-foreground text-sm">Schedule and track demo class conversions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demos.map((demo) => (
          <motion.div layout key={demo.id} className="dashboard-card overflow-hidden group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                <GraduationCap size={24} />
              </div>
              <div className={`px-2 py-1 rounded border text-[10px] font-bold uppercase tracking-wider ${getStatusColor(demo.outcome)}`}>
                {demo.outcome}
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-primary truncate mb-4">{demo.studentName}</h3>
            
            <div className="flex items-center gap-2 text-slate-500 mb-6">
              <Clock size={14} />
              <span className="text-xs font-bold uppercase tracking-tighter">{new Date(demo.date).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })}</span>
            </div>

            <div className="pt-4 border-t border-slate-50 flex items-center gap-3">
              <button className="flex-1 py-2 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-100 transition-colors">
                UPDATE OUTCOME
              </button>
              <button className="flex-1 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-1">
                ADMIT <ArrowRight size={12} />
              </button>
            </div>
          </motion.div>
        ))}
        {demos.length === 0 && (
          <div className="col-span-full border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
            <GraduationCap size={48} className="text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400">No Demos Scheduled</h3>
            <p className="text-slate-300 text-sm mt-2">Demos will appear here once scheduled from an enquiry.</p>
          </div>
        )}
      </div>
    </div>
  );
};
