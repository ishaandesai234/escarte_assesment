import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, Timestamp, limit, deleteDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { ChatMessage } from '../../types';
import { Send, Image as ImageIcon, User as UserIcon, Loader2, Sparkles, Trash2, AtSign } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const StaffChat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [staffMembers, setStaffMembers] = useState<any[]>([]);

  useEffect(() => {
    // Record current user in staff list
    if (user) {
      const staffRef = doc(db, 'staff', user.id);
      setDoc(staffRef, {
        id: user.id,
        name: user.name,
        designation: user.designation,
        lastSeen: serverTimestamp()
      }, { merge: true });
    }

    const q = query(collection(db, 'messages'), orderBy('createdAt', 'asc'), limit(100));
    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as ChatMessage)));
      setLoading(false);
    });

    const qStaff = query(collection(db, 'staff'), orderBy('name', 'asc'));
    const unsubscribeStaff = onSnapshot(qStaff, (snapshot) => {
      setStaffMembers(snapshot.docs.map(d => d.data()));
    });

    return () => {
      unsubscribeMessages();
      unsubscribeStaff();
    };
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleDelete = async (msgId: string) => {
    // Already enforced in the UI but safety first
    try {
      await deleteDoc(doc(db, 'messages', msgId));
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const renderContent = (content: string) => {
    // Simple regex to match @mentions
    const parts = content.split(/(@[\w\s]+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return <span key={i} className="font-black text-secondary bg-white/20 px-1 rounded-sm">{part}</span>;
      }
      return part;
    });
  };

  const handleSend = async (e?: React.FormEvent, imageUrl?: string) => {
    if (e) e.preventDefault();
    if (!input.trim() && !imageUrl) return;

    const messageContent = input.trim();
    setInput('');

    await addDoc(collection(db, 'messages'), {
      senderId: user?.id,
      senderName: user?.name,
      senderRole: user?.designation,
      content: messageContent,
      imageUrl: imageUrl || null,
      createdAt: Timestamp.now()
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app with Firebase Storage enabled, we'd upload and get URL.
      // For this environment, we'll use a data URL for demo purposes or a placeholder.
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        handleSend(undefined, dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-secondary" size={40} /></div>;

  return (
    <div className="flex h-[calc(100vh-140px)] bg-slate-50 rounded-2xl border border-border overflow-hidden shadow-2xl">
      {/* Staff List Sidebar */}
      <div className="w-64 bg-white border-r border-border hidden md:flex flex-col">
        <div className="p-4 border-b border-border bg-slate-50/50">
          <h3 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
            <UserIcon size={14} className="text-secondary" />
            Active Staff
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {staffMembers.map((staff) => (
            <div 
              key={staff.id} 
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer ${staff.id === user?.id ? 'bg-primary/5' : 'hover:bg-slate-50'}`}
              onClick={() => setInput(`@${staff.name} `)}
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-200 uppercase">
                {staff.name.substring(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{staff.name}</p>
                <p className="text-[9px] font-medium text-muted-foreground uppercase">{staff.designation}</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-border bg-slate-50 text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
          {staffMembers.length} Team Members Registered
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-primary p-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary rounded-lg">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-bold">Staff Operations Channel</h2>
              <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold">Internal Discussion only</p>
            </div>
          </div>
          <div className="flex -space-x-2">
             <div className="w-8 h-8 rounded-full border-2 border-primary bg-secondary flex items-center justify-center text-[10px] font-bold">ME</div>
             {staffMembers.slice(0, 2).map((s, i) => (
                s.id !== user?.id && <div key={i} className="w-8 h-8 rounded-full border-2 border-primary bg-slate-400 flex items-center justify-center text-[10px] font-bold uppercase">{s.name.substring(0, 2)}</div>
             ))}
          </div>
        </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
      >
        {messages.map((m, i) => {
          const isMe = m.senderId === user?.id;
          const showHeader = i === 0 || messages[i-1].senderId !== m.senderId;

          return (
            <div key={m.id} className={`flex flex-col group ${isMe ? 'items-end' : 'items-start'}`}>
              {showHeader && (
                <div className={`flex items-center gap-2 mb-1 px-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                   <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">{m.senderName}</span>
                   <span className="text-[10px] font-medium text-muted-foreground bg-slate-200 px-1.5 rounded uppercase">{m.senderRole}</span>
                </div>
              )}
              <div className={`flex items-center gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`max-w-[75%] p-3 rounded-2xl shadow-sm border ${
                    isMe 
                      ? 'bg-primary text-white rounded-tr-none border-primary' 
                      : 'bg-white text-slate-800 rounded-tl-none border-border'
                  }`}
                >
                  {m.imageUrl && (
                    <img 
                      src={m.imageUrl} 
                      alt="attachment" 
                      className="max-w-full rounded-lg mb-2 shadow-inner border border-black/5" 
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {renderContent(m.content)}
                  </p>
                  <div className={`text-[8px] mt-1.5 opacity-50 font-bold ${isMe ? 'text-right' : 'text-left'}`}>
                    {m.createdAt?.toDate?.().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Just now'}
                  </div>
                </motion.div>
                
                {(isMe || user?.designation === 'Owner') && (
                  <button 
                    onClick={() => handleDelete(m.id)}
                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="Delete Message"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-border">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-secondary"
          >
            <ImageIcon size={22} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            className="hidden" 
            accept="image/*" 
          />
          <input 
            type="text"
            className="flex-1 bg-slate-50 border border-slate-200 px-6 py-3 rounded-full text-sm focus:ring-2 focus:ring-secondary/20 outline-none transition-all placeholder:text-slate-400"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            type="submit"
            className="p-3 bg-secondary text-white rounded-full hover:shadow-lg hover:shadow-secondary/20 active:scale-90 transition-all flex items-center justify-center"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};
