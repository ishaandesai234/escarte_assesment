import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { 
  CheckSquare, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Calendar, 
  Clock,
  ArrowRight,
  Plus,
  BarChart3
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, limit, orderBy, onSnapshot } from 'firebase/firestore';
import { Task, Enquiry, Demo } from '../types';

export const Dashboard: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    tasksToday: 0,
    activeEnquiries: 0,
    upcomingDemos: 0,
    totalStudents: 0
  });
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Real-time stats listeners
    const todayStr = new Date().toISOString().split('T')[0];

    const unsubTasks = onSnapshot(
      query(collection(db, 'tasks'), where('date', '==', todayStr)),
      (snap) => setStats(prev => ({ ...prev, tasksToday: snap.size }))
    );

    const unsubEnquiries = onSnapshot(
      query(collection(db, 'enquiries'), where('status', '==', 'new')),
      (snap) => setStats(prev => ({ ...prev, activeEnquiries: snap.size }))
    );

    const unsubDemos = onSnapshot(
      query(collection(db, 'demos'), where('outcome', '==', 'pending')),
      (snap) => setStats(prev => ({ ...prev, upcomingDemos: snap.size }))
    );

    const unsubStudents = onSnapshot(
      collection(db, 'students'),
      (snap) => setStats(prev => ({ ...prev, totalStudents: snap.size }))
    );

    // Latest critical tasks for the logged in user
    const isOwner = user?.designation === 'Owner';
    const tasksQuery = isOwner 
      ? query(collection(db, 'tasks'), where('status', '!=', 'done'), limit(4))
      : query(collection(db, 'tasks'), where('assignedTo', '==', user?.id || ''), where('status', '!=', 'done'), limit(4));

    const unsubRecent = onSnapshot(tasksQuery, (snap) => {
      setRecentTasks(snap.docs.map(d => ({ ...d.data(), id: d.id } as Task)));
    });

    return () => {
      unsubTasks();
      unsubEnquiries();
      unsubDemos();
      unsubStudents();
      unsubRecent();
    };
  }, [user]);

  const cards = [
    { title: 'Tasks Today', value: stats.tasksToday, icon: CheckSquare, color: 'bg-blue-500' },
    { title: 'Active Enquiries', value: stats.activeEnquiries, icon: MessageSquare, color: 'bg-indigo-500' },
    { title: 'Upcoming Demos', value: stats.upcomingDemos, icon: Calendar, color: 'bg-emerald-500' },
    { title: 'Total Students', value: stats.totalStudents, icon: Users, color: 'bg-violet-500' },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Hello, {user?.name}</h1>
          <p className="text-muted-foreground mt-1 text-lg">Welcome back to your operations dashboard.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 border border-secondary/20 shadow-sm">
            <Clock size={16} /> {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
          </span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onNavigate(card.title === 'Tasks Today' ? 'Task Board' : card.title)}
            className="dashboard-card group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">{card.title}</p>
                <h3 className="text-4xl font-bold text-primary">{card.value}</h3>
              </div>
              <div className={`${card.color} p-3 rounded-xl text-white shadow-lg shadow-black/10 group-hover:scale-110 transition-transform`}>
                <card.icon size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm font-medium text-secondary">
              View Details <ArrowRight size={14} className="ml-1" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-primary">Critical Tasks</h2>
            <button className="text-secondary font-semibold text-sm flex items-center gap-1 hover:underline">
              View All Tasks <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div key={task.id} className="dashboard-card flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer border-l-4 border-l-primary">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${task.priority === 'high' ? 'bg-red-500 animate-pulse' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                  <div>
                    <h4 className="font-bold text-primary">{task.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Due by 5:00 PM today</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    task.status === 'pending' ? 'bg-slate-100 text-slate-600' : 'bg-secondary/10 text-secondary'
                  }`}>
                    {task.status}
                  </span>
                  <button className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-border">
                    <CheckSquare size={18} className="text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & AI */}
        <div className="space-y-6">
          <div className="dashboard-card bg-primary text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Notice Board</h3>
              <div className="space-y-4">
                <div className="p-3 bg-white/10 rounded-lg border border-white/10">
                  <p className="text-sm font-medium">New Batch for Advanced Piano starts next Monday. Teachers please note.</p>
                  <p className="text-[10px] text-white/50 mt-2">Posted by Owner • 2 hours ago</p>
                </div>
                <button className="w-full py-2 bg-white text-primary rounded-lg font-bold text-sm hover:bg-opacity-90 transition-all">
                  Read All Notices
                </button>
              </div>
            </div>
          </div>

          <div className="dashboard-card border-none bg-gradient-to-br from-secondary to-teal-700 text-white shadow-xl shadow-secondary/20">
            <h3 className="text-lg font-bold mb-4 flex items-center justify-between">
              Performance Overview
              <BarChart3 size={20} className="opacity-50" />
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm text-white/70">Conversion Rate</span>
                <span className="text-2xl font-bold">68%</span>
              </div>
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                <div className="bg-white h-full" style={{ width: '68%' }} />
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Demos this week</span>
                <span className="font-bold">12 / 15</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for ChevronRight since it was imported but not defined in local variables
const ChevronRight = ({ size, className }: { size?: number, className?: string }) => (
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
    <path d="m9 18 6-6-6-6"/>
  </svg>
);
