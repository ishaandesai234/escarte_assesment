import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, deleteDoc, getDocs } from 'firebase/firestore';
import { Task, User } from '../../types';
import { Plus, Search, Filter, Loader2, Calendar as CalendarIcon, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';

export const WeeklyPlanner: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [staff, setStaff] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as any,
    assignedTo: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('date', 'asc'));
    const unsubscribeTasks = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Task)));
      setLoading(false);
    });

    // Mock staff for now, in real app fetch from users collection
    setStaff([
      { id: '1', name: 'Ishaan Desai', designation: 'Owner' },
      { id: '2', name: 'Sara Khan', designation: 'Teacher' },
      { id: '3', name: 'John Doe', designation: 'Teacher' },
    ]);

    return () => unsubscribeTasks();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.assignedTo) return;

    const teacher = staff.find(s => s.id === formData.assignedTo);
    
    await addDoc(collection(db, 'tasks'), {
      ...formData,
      status: 'pending',
      teacherName: teacher?.name || 'Unknown'
    });
    setShowModal(false);
    setFormData({ ...formData, title: '', description: '' });
  };

  const getWeekDays = () => {
    const today = new Date();
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-secondary" size={40} /></div>;

  const days = getWeekDays();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Weekly Planner</h1>
          <p className="text-muted-foreground text-sm">Strategize your school's weekly operation and assign tasks.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> Schedule Task
        </button>
      </div>

      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-6 min-w-[1200px]">
          {days.map((day) => (
            <div key={day} className="flex-1 space-y-4">
              <div className="dashboard-card bg-primary text-white p-3 text-center rounded-xl shadow-md">
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-60">
                  {new Date(day).toLocaleDateString('en-IN', { weekday: 'short' })}
                </p>
                <h4 className="text-xl font-bold">
                  {new Date(day).getDate()}
                </h4>
              </div>
              
              <div className="space-y-3">
                {tasks.filter(t => t.date === day).map((task) => (
                  <div key={task.id} className="dashboard-card p-3 border-l-4 text-xs group" style={{ borderLeftColor: task.priority === 'high' ? '#ef4444' : '#f59e0b' }}>
                    <h5 className="font-bold text-primary truncate">{task.title}</h5>
                    <div className="flex items-center gap-2 mt-2">
                       <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-bold">
                        {task.teacherName?.charAt(0)}
                       </div>
                       <span className="text-muted-foreground truncate">{task.teacherName}</span>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => { setFormData({ ...formData, date: day }); setShowModal(true); }}
                  className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-300 hover:border-secondary hover:text-secondary transition-all flex items-center justify-center gap-1"
                >
                  <Plus size={14} /> <span className="text-[10px] font-bold">ADD</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl w-full max-w-md p-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Schedule Operational Task</h3>
              <button onClick={() => setShowModal(false)}><Plus className="rotate-45" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Task Title</label>
                <input required className="input-field" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Assign To</label>
                  <select required className="input-field" value={formData.assignedTo} onChange={e => setFormData({...formData, assignedTo: e.target.value})}>
                    <option value="">Select Staff</option>
                    {staff.map(s => <option key={s.id} value={s.id}>{s.name} ({s.designation})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Date</label>
                  <input type="date" required className="input-field" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Priority</label>
                <div className="flex gap-2">
                  {['low', 'medium', 'high'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData({...formData, priority: p as any})}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                        formData.priority === p 
                          ? p === 'high' ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/30' 
                          : p === 'medium' ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/30' 
                          : 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/30'
                          : 'bg-white border-border text-muted-foreground'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-slate-100 rounded-lg font-bold">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">Schedule</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
