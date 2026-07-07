import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { Task } from '../../types';
import { Plus, Filter, MoreVertical, Flag, CheckCircle2, Circle, Clock, Loader2, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

export const TaskBoard: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' as any });

  useEffect(() => {
    const isOwner = user?.designation === 'Owner';
    const q = isOwner 
      ? query(collection(db, 'tasks'))
      : query(collection(db, 'tasks'), where('assignedTo', '==', user?.id || ''));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskData = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Task));
      setTasks(taskData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const taskRef = doc(db, 'tasks', id);
    const nextStatus = currentStatus === 'pending' ? 'in progress' : currentStatus === 'in progress' ? 'done' : 'pending';
    await updateDoc(taskRef, { status: nextStatus });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;
    
    await addDoc(collection(db, 'tasks'), {
      ...newTask,
      status: 'pending',
      assignedTo: user?.id,
      teacherName: user?.name,
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddModal(false);
    setNewTask({ title: '', description: '', priority: 'medium' });
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-secondary" size={40} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Daily Task Board</h1>
          <p className="text-muted-foreground text-sm">Manage and track your operational activities.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-border rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-slate-50">
            <Filter size={16} /> Filter
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} /> New Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {['pending', 'in progress', 'done'].map((status) => (
          <div key={status} className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              {status} <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">{tasks.filter(t => t.status === status).length}</span>
            </h3>
            <div className="space-y-3">
              {tasks.filter(t => t.status === status).map((task) => (
                <motion.div
                  layout
                  key={task.id}
                  className="dashboard-card p-4 hover:shadow-md transition-all border-l-4"
                  style={{ borderLeftColor: task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#f59e0b' : '#3b82f6' }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-primary leading-tight">{task.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {user?.designation === 'Owner' && (
                        <button 
                          onClick={() => handleDelete(task.id)}
                          className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-60 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => toggleStatus(task.id, task.status)}
                        className="p-1 hover:bg-slate-100 rounded transition-colors"
                      >
                        {status === 'done' ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Circle size={20} className="text-slate-300" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-muted-foreground" />
                      <span className="text-[10px] font-medium text-muted-foreground uppercase">{task.date}</span>
                    </div>
                    {user?.designation === 'Owner' && (
                      <span className="text-[10px] bg-primary/5 px-2 py-1 rounded text-primary font-bold">{task.teacherName}</span>
                    )}
                  </div>
                </motion.div>
              ))}
              {tasks.filter(t => t.status === status).length === 0 && (
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
                  <p className="text-xs text-muted-foreground italic">No tasks in this stage.</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl w-full max-w-md p-6 overflow-hidden relative"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">New Operatonal Task</h3>
              <button onClick={() => setShowAddModal(false)}><Plus className="rotate-45" /></button>
            </div>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Task Title</label>
                <input 
                  autoFocus
                  required
                  className="input-field" 
                  placeholder="e.g., Follow up with Batch B parents"
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Description (Optional)</label>
                <textarea 
                  className="input-field min-h-[100px] resize-none" 
                  placeholder="Details about the task..."
                  value={newTask.description}
                  onChange={e => setNewTask({...newTask, description: e.target.value})}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-1">Priority</label>
                  <select 
                    className="input-field"
                    value={newTask.priority}
                    onChange={e => setNewTask({...newTask, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 bg-slate-100 rounded-lg font-bold">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">Create Task</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
