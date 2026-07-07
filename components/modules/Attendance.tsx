import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, onSnapshot, addDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { Batch, Student, Attendance } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { Check, X, Calendar, Users, Loader2 } from 'lucide-react';

export const AttendanceModule: React.FC = () => {
  const { user } = useAuth();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [presentIds, setPresentIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubStudents = onSnapshot(collection(db, 'students'), (snap) => {
      setStudents(snap.docs.map(d => ({ ...d.data(), id: d.id } as Student)));
    });
    
    const isOwner = user?.designation === 'Owner';
    
    const q = isOwner 
      ? collection(db, 'batches')
      : query(collection(db, 'batches'), where('teacherId', '==', user?.id || ''));
      
    const unsubBatches = onSnapshot(collection(db, 'batches'), (snap) => {
      setBatches(snap.docs.map(d => ({ ...d.data(), id: d.id } as Batch)));
      setLoading(false);
    });
    
    return () => { unsubStudents(); unsubBatches(); };
  }, [user]);

  const toggleStudent = (id: string) => {
    setPresentIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSave = async () => {
    if (!selectedBatch) return;
    await addDoc(collection(db, 'attendance'), {
      batchId: selectedBatch,
      date: new Date().toISOString().split('T')[0],
      presentStudentIds: presentIds,
      teacherId: user?.id,
      teacherName: user?.name
    });
    alert("Attendance logged successfully!");
    setSelectedBatch(null);
    setPresentIds([]);
  };

  const currentBatchStudents = students.filter(s => s.batchId === selectedBatch);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-secondary" size={40} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Daily Attendance</h1>
          <p className="text-muted-foreground text-sm">Mark student presence for your batches.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-border">
          <Calendar size={16} className="text-secondary" />
          <span className="font-bold text-sm">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}</span>
        </div>
      </div>

      {!selectedBatch ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch) => (
            <div 
              key={batch.id} 
              onClick={() => setSelectedBatch(batch.id)}
              className="dashboard-card cursor-pointer hover:border-secondary transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users size={24} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Students</p>
                  <p className="text-xl font-bold text-primary">{students.filter(s => s.batchId === batch.id).length}</p>
                </div>
              </div>
              <h3 className="text-lg font-bold text-primary">{batch.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{batch.schedule}</p>
              <button className="w-full py-2 bg-slate-50 text-primary font-bold text-sm rounded-lg group-hover:bg-secondary group-hover:text-white transition-all">
                Mark Attendance
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <button onClick={() => setSelectedBatch(null)} className="text-slate-400 font-bold text-sm flex items-center gap-2 hover:text-primary transition-colors">
            <ArrowRight className="rotate-180" size={16} /> Back to Batches
          </button>
          
          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold">Attendance: {batches.find(b => b.id === selectedBatch)?.name}</h2>
              <div className="text-sm font-bold">
                <span className="text-secondary">{presentIds.length}</span> / {currentBatchStudents.length} Present
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentBatchStudents.map((student) => (
                <div 
                  key={student.id}
                  onClick={() => toggleStudent(student.id)}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    presentIds.includes(student.id) 
                      ? 'bg-emerald-50 border-emerald-500 shadow-md translate-y-[-2px]' 
                      : 'bg-white border-border hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      presentIds.includes(student.id) ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {student.name.charAt(0)}
                    </div>
                    <span className={`font-bold ${presentIds.includes(student.id) ? 'text-emerald-700' : 'text-primary'}`}>{student.name}</span>
                  </div>
                  {presentIds.includes(student.id) ? (
                    <Check size={20} className="text-emerald-600" />
                  ) : (
                    <X size={20} className="text-slate-300" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-10 flex gap-4">
              <button 
                onClick={() => setPresentIds(currentBatchStudents.map(s => s.id))}
                className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-bold"
              >
                Mark All Present
              </button>
              <button 
                onClick={handleSave}
                className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
              >
                <Check size={20} /> Submit Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper for ArrowRight again to be safe
const ArrowRight = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14m-7-7 7 7-7 7"/>
  </svg>
);

// We need define where here because it's imported from firestore but not used in layout.
// Actually standard where is fine if it works.
import { where } from 'firebase/firestore'; 
