import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, Timestamp, where, deleteDoc } from 'firebase/firestore';
import { Notice } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Send, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

export const NoticeBoard: React.FC = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: '', content: '' });

  useEffect(() => {
    const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotices(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Notice)));
    });
    return () => unsubscribe();
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'notices'), {
      ...newNotice,
      createdAt: Timestamp.now(),
      createdBy: user?.name,
      readBy: []
    });
    setNewNotice({ title: '', content: '' });
    setShowAdd(false);
  };

  const markAsRead = async (noticeId: string) => {
    if (!user || notices.find(n => n.id === noticeId)?.readBy.includes(user.id)) return;
    const ref = doc(db, 'notices', noticeId);
    await updateDoc(ref, {
      readBy: [...(notices.find(n => n.id === noticeId)?.readBy || []), user.id]
    });
  };

  const handleDelete = async (noticeId: string) => {
    try {
      await deleteDoc(doc(db, 'notices', noticeId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Notice Board</h1>
          <p className="text-muted-foreground">Official communication and announcements.</p>
        </div>
        {user?.designation === 'Owner' && (
          <button onClick={() => setShowAdd(!showAdd)} className="btn-primary flex items-center gap-2">
            <Bell size={18} /> {showAdd ? 'Cancel' : 'Post Notice'}
          </button>
        )}
      </div>

      {showAdd && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="dashboard-card border-2 border-secondary/30">
          <form onSubmit={handlePost} className="space-y-4">
            <input required placeholder="Announcement Title" className="input-field font-bold" value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})} />
            <textarea required placeholder="Write the details here..." className="input-field min-h-[120px] resize-none" value={newNotice.content} onChange={e => setNewNotice({...newNotice, content: e.target.value})} />
            <div className="flex justify-end">
              <button type="submit" className="btn-primary flex items-center gap-2 px-8">
                <Send size={16} /> Post Announcement
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="space-y-6">
        {notices.map((notice) => (
          <motion.div 
            key={notice.id} 
            layout
            className={`dashboard-card relative overflow-hidden ${!notice.readBy.includes(user?.id || '') ? 'border-l-4 border-l-secondary shadow-lg' : 'opacity-80'}`}
          >
            {!notice.readBy.includes(user?.id || '') && (
              <div className="absolute top-4 right-4 bg-secondary/10 text-secondary px-2 py-1 rounded text-[10px] font-bold animate-pulse">NEW</div>
            )}
            {user?.designation === 'Owner' && (
              <button 
                onClick={() => handleDelete(notice.id)}
                className="absolute top-4 right-16 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Delete Notice"
              >
                <Trash2 size={16} />
              </button>
            )}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-primary">
                <Bell size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-primary mb-2">{notice.title}</h3>
                <div className="text-slate-600 space-y-4">
                   <p className="whitespace-pre-wrap">{notice.content}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                    <span className="flex items-center gap-1"><Clock size={12} /> {notice.createdAt?.toDate?.().toLocaleDateString() || 'Today'}</span>
                    <span>Posted by { (notice as any).createdBy || 'Owner' }</span>
                  </div>
                  <button 
                    onClick={() => markAsRead(notice.id)}
                    disabled={notice.readBy.includes(user?.id || '')}
                    className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all ${
                      notice.readBy.includes(user?.id || '') ? 'text-emerald-500 bg-emerald-50' : 'text-slate-400 bg-slate-100'
                    }`}
                  >
                    <CheckCircle size={14} /> {notice.readBy.includes(user?.id || '') ? 'Read' : 'Acknowledge'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
