import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, getDocs, addDoc, deleteDoc, doc, where } from 'firebase/firestore';
import { Student, Batch } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Users, Layout, Search, ArrowRight, UserPlus, Trash2, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Students: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    parentName: '', 
    contact: '', 
    batchId: '', 
    course: 'Foundation Lab',
    feeAmount: 19500, 
    feeStatus: 'pending' as any 
  });

  const COURSES = {
    'Foundation Lab': { cost: 18100, kit: 1400, total: 19500 },
    'Profile Lab': { cost: 15400, kit: 1400, total: 16800 }
  };

  const handleCourseChange = (course: string) => {
    const selected = course as keyof typeof COURSES;
    setFormData({
      ...formData,
      course,
      feeAmount: COURSES[selected].total
    });
  };

  useEffect(() => {
    const unsubscribeStudents = onSnapshot(collection(db, 'students'), (snap) => {
      setStudents(snap.docs.map(d => ({ ...d.data(), id: d.id } as Student)));
      setLoading(false);
    });
    const unsubscribeBatches = onSnapshot(collection(db, 'batches'), (snap) => {
      setBatches(snap.docs.map(d => ({ ...d.data(), id: d.id } as Batch)));
    });
    return () => { unsubscribeStudents(); unsubscribeBatches(); };
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'students'), { ...formData, feeDueDate: new Date().toISOString().split('T')[0] });
    setShowAdd(false);
    setFormData({ name: '', parentName: '', contact: '', batchId: '', course: 'Foundation Lab', feeAmount: 19500, feeStatus: 'pending' });
  };

  const handleDelete = async (studentId: string, isPermanent: boolean = false) => {
    try {
      await deleteDoc(doc(db, 'students', studentId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Student Records</h1>
          <p className="text-muted-foreground text-sm">Centralized database of all active students.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
          <UserPlus size={18} /> Enroll New Student
        </button>
      </div>

      <div className="dashboard-card p-0 overflow-hidden">
        <div className="p-4 border-b border-border bg-slate-50 flex items-center gap-4">
          <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
             <input className="w-full pl-10 pr-4 py-2 bg-white border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/10" placeholder="Search by student name or contact..." />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-semibold bg-white">
            <Layout size={16} /> All Batches
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Student Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Parent Details</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Batch</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Fee Status</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-primary">{student.name}</p>
                    <p className="text-[10px] uppercase font-bold text-secondary">{student.contact}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{student.parentName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-primary/20 text-primary text-[10px] font-bold rounded block mb-1">
                      {batches.find(b => b.id === student.batchId)?.name || 'Generic Batch'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium italic">{(student as any).course || 'Basic'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      student.feeStatus === 'paid' ? 'bg-emerald-50 text-emerald-600' : 
                      student.feeStatus === 'overdue' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {student.feeStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    {user?.designation === 'Owner' && (
                      <>
                        <button 
                          onClick={() => handleDelete(student.id, true)}
                          className="p-2 hover:bg-red-50 rounded-lg text-slate-300 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
                          title="Delete / Enrollment Error"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(student.id, false)}
                          className="p-2 hover:bg-amber-50 rounded-lg text-slate-300 hover:text-amber-600 transition-all border border-transparent hover:border-amber-100"
                          title="Student Left"
                        >
                          <LogOut size={16} />
                        </button>
                      </>
                    )}
                    <button className="p-2 hover:bg-white rounded-lg text-muted-foreground hover:text-primary transition-all border border-transparent hover:border-border">
                      <ArrowRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-2xl w-full max-w-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Enroll Student</h2>
            <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-1">Full Name</label>
                <input required className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-1">Course Program</label>
                <select 
                  className="input-field" 
                  value={formData.course} 
                  onChange={e => handleCourseChange(e.target.value)}
                >
                  <option value="Foundation Lab">Foundation Lab (6 Months - ₹19,500)</option>
                  <option value="Profile Lab">Profile Lab (3 Months - ₹16,800)</option>
                </select>
                <p className="text-[10px] mt-1 text-muted-foreground italic">*Price includes ₹1,400 Kit fee</p>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-1">Parent's Name</label>
                <input className="input-field" value={formData.parentName} onChange={e => setFormData({...formData, parentName: e.target.value})} />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-1">Contact</label>
                <input required className="input-field" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-1">Assign to Batch</label>
                <select required className="input-field" value={formData.batchId} onChange={e => setFormData({...formData, batchId: e.target.value})}>
                  <option value="">Select a batch</option>
                  {batches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.subject})</option>)}
                </select>
              </div>
              <div className="col-span-2 flex gap-3 mt-4">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="flex-1 btn-primary py-3">Enroll Student</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
