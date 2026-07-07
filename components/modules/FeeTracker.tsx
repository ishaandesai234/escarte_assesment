import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Student } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { Wallet, AlertCircle, CheckCircle2, MoreVertical, Search, Filter, LogOut } from 'lucide-react';

export const FeeTracker: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

  useEffect(() => {
    return onSnapshot(collection(db, 'students'), (snap) => {
      setStudents(snap.docs.map(d => ({ ...d.data(), id: d.id } as Student)));
    });
  }, []);

  const handleStatusUpdate = async (studentId: string, currentStatus: string) => {
    if (currentStatus === 'paid') return;
    
    try {
      const studentRef = doc(db, 'students', studentId);
      await updateDoc(studentRef, { feeStatus: 'paid' });
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'students', id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const filteredStudents = students.filter(s => filter === 'all' || s.feeStatus === filter);
  const totalRevenue = students.reduce((acc, s) => acc + (s.feeStatus === 'paid' ? s.feeAmount : 0), 0);
  const pendingRevenue = students.reduce((acc, s) => acc + (s.feeStatus !== 'paid' ? s.feeAmount : 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">Fee Tracker</h1>
        <p className="text-muted-foreground text-sm">Monitor revenue and payment statuses across all students.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dashboard-card bg-emerald-500 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-black/5 flex flex-col p-6">
             <p className="text-sm font-bold uppercase tracking-widest opacity-70">Total Collected</p>
             <h2 className="text-4xl font-bold mt-2">₹{totalRevenue.toLocaleString()}</h2>
             <div className="mt-auto flex items-center justify-between">
                <span className="text-xs font-medium">This month so far</span>
                <Wallet size={20} className="opacity-50" />
             </div>
          </div>
        </div>
        <div className="dashboard-card bg-amber-500 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-black/5 flex flex-col p-6">
             <p className="text-sm font-bold uppercase tracking-widest opacity-70">Pending Amount</p>
             <h2 className="text-4xl font-bold mt-2">₹{pendingRevenue.toLocaleString()}</h2>
             <div className="mt-auto flex items-center justify-between">
                <span className="text-xs font-medium">Follow-up required</span>
                <AlertCircle size={20} className="opacity-50" />
             </div>
          </div>
        </div>
      </div>

      <div className="dashboard-card p-0">
        <div className="p-4 bg-slate-50 border-b border-border flex items-center justify-between">
           <div className="flex gap-2">
             {['all', 'paid', 'pending', 'overdue'].map(f => (
               <button 
                 key={f}
                 onClick={() => setFilter(f as any)}
                 className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                   filter === f ? 'bg-primary text-white' : 'text-slate-400 hover:text-primary'
                 }`}
               >
                 {f}
               </button>
             ))}
           </div>
           <button className="p-2 border border-border rounded-lg bg-white">
             <Filter size={16} className="text-slate-500" />
           </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-100/50 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Due Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-primary">{student.name}</p>
                    <p className="text-[10px] font-bold text-slate-400">Batch ID: {student.batchId.slice(0, 8)}</p>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-primary">₹{student.feeAmount}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded">{student.feeDueDate}</span>
                  </td>
                  <td className="px-6 py-4">
                     <button 
                       onClick={() => handleStatusUpdate(student.id, student.feeStatus)}
                       disabled={student.feeStatus === 'paid'}
                       className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border transition-all ${
                         student.feeStatus === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                         student.feeStatus === 'overdue' ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' : 
                         'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100'
                       }`}
                       title={user?.designation === 'Owner' && student.feeStatus !== 'paid' ? "Click to mark as Paid" : ""}
                     >
                       {student.feeStatus}
                     </button>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-4">
                    <button className="text-secondary font-bold text-[10px] uppercase hover:underline">
                      SEND REMINDER
                    </button>
                    {user?.designation === 'Owner' && (
                      <button 
                        onClick={() => handleDelete(student.id)}
                        className="p-1 text-slate-300 hover:text-amber-600 transition-colors"
                        title="Student Left"
                      >
                        <LogOut size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
