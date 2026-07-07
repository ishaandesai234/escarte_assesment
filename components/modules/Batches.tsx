import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Batch } from '../../types';
import { Plus, Layout, User, Clock, BookOpen, MoreVertical, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';

export const Batches: React.FC = () => {
  const { user } = useAuth();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ name: '', subject: '', schedule: '', teacherId: '1', teacherName: 'Ishaan Desai' });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'batches'), (snap) => {
      setBatches(snap.docs.map(d => ({ ...d.data(), id: d.id } as Batch)));
    });
    return unsub;
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'batches'), formData);
    setShowAdd(false);
    setFormData({ ...formData, name: '', subject: '', schedule: '' });
  };

  const handleDelete = async (batchId: string) => {
    try {
      await deleteDoc(doc(db, 'batches', batchId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleClearAll = async () => {
    // Only use confirm for extreme bulk actions, but Owner requested it
    if (!window.confirm('Clear ALL class batches? This cannot be undone.')) return;
    try {
      const deletePromises = batches.map(batch => deleteDoc(doc(db, 'batches', batch.id)));
      await Promise.all(deletePromises);
    } catch (err) {
      console.error("Clear all failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Class Batches</h1>
          <p className="text-muted-foreground text-sm">Organize and manage class schedules.</p>
        </div>
        {user?.designation === 'Owner' && (
          <div className="flex gap-2">
            <button onClick={handleClearAll} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-all">
              Clear All Batches
            </button>
            <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
              <Plus size={18} /> New Batch
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map((batch) => (
          <div key={batch.id} className="dashboard-card group relative hover:border-red-200 transition-all">
            {user?.designation === 'Owner' && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(batch.id);
                }}
                className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all z-20"
                title="Delete Batch"
              >
                <Trash2 size={18} />
              </button>
            )}
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-primary mb-1">{batch.name}</h3>
            <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-6">{batch.subject}</p>
            
            <div className="space-y-3 pt-6 border-t border-slate-50">
              <div className="flex items-center gap-3 text-slate-600">
                <Clock size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium">{batch.schedule}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <User size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium">{batch.teacherName}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Create New Batch</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <input required className="input-field" placeholder="Batch Name (e.g., Piano Beginners A)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required className="input-field" placeholder="Subject/Course" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
              <input required className="input-field" placeholder="Schedule (e.g., Mon/Wed 4:00 PM)" value={formData.schedule} onChange={e => setFormData({...formData, schedule: e.target.value})} />
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="flex-1 btn-primary py-3">Create Batch</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
