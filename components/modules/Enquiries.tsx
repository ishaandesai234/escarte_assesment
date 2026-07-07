import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { Enquiry } from '../../types';
import { Plus, Search, Phone, Mail, GraduationCap, LayoutGrid, List, Filter, UserPlus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';

export const Enquiries: React.FC = () => {
  const { user } = useAuth();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    contact: '',
    course: '',
    source: 'referral',
    assignedTo: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const q = query(collection(db, 'enquiries'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEnquiries(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Enquiry)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'enquiries'), {
      ...formData,
      status: 'new'
    });
    setShowModal(false);
    setFormData({ ...formData, studentName: '', parentName: '', contact: '', course: '' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this enquiry?')) return;
    try {
      await deleteDoc(doc(db, 'enquiries', id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete enquiry. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary text-display">Student Enquiries</h1>
          <p className="text-muted-foreground text-sm">Track and manage potential admissions.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-border rounded-lg p-1">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:bg-slate-50'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:bg-slate-50'}`}
            >
              <List size={18} />
            </button>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <UserPlus size={18} /> New Enquiry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {enquiries.map((enquiry) => (
          <motion.div 
            layout
            key={enquiry.id} 
            className="dashboard-card group overflow-hidden relative"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-primary truncate pr-20">{enquiry.studentName}</h3>
              <div className="flex items-center gap-2">
                {user?.designation === 'Owner' && (
                  <button 
                    onClick={() => handleDelete(enquiry.id)}
                    className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  enquiry.status === 'converted' ? 'bg-emerald-500 text-white' : 
                  enquiry.status === 'demo_scheduled' ? 'bg-blue-500 text-white' : 
                  'bg-slate-100 text-slate-500'
                }`}>
                  {enquiry.status}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
               <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                    <Phone size={14} />
                  </div>
                  <span className="text-sm font-medium">{enquiry.contact}</span>
               </div>
               <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                    <GraduationCap size={14} />
                  </div>
                  <span className="text-sm font-medium">{enquiry.parentName}</span>
               </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-secondary border-2 border-white flex items-center justify-center text-[10px] font-bold text-white uppercase">
                  S
                </div>
              </div>
              <button className="text-secondary font-bold text-xs hover:underline flex items-center gap-1">
                Schedule Demo <Plus size={12} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-2xl w-full max-w-lg p-8">
            <h2 className="text-2xl font-bold mb-6">New Student Enquiry</h2>
            <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-1">Student Name</label>
                <input required className="input-field" value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-1">Parent's Name</label>
                <input className="input-field" value={formData.parentName} onChange={e => setFormData({...formData, parentName: e.target.value})} />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-1">Contact Number</label>
                <input required className="input-field" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
              </div>
               <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold mb-1">Course/Subject</label>
                <input className="input-field" value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Source</label>
                <select className="input-field" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})}>
                  <option value="walk-in">Walk-in</option>
                  <option value="phone">Phone Call</option>
                  <option value="referral">Referral</option>
                  <option value="social">Social Media</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Lead Date</label>
                <input type="date" className="input-field" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div className="col-span-2 flex gap-3 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="flex-1 btn-primary py-3">Log Enquiry</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
