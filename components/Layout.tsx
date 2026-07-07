import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Users, 
  GraduationCap, 
  MessageSquare, 
  Bell, 
  BarChart3, 
  Wallet,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { AIChatbot } from './AIChatbot';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, roles: ['Owner', 'Manager', 'Teacher'] },
    { name: 'Staff Chat', icon: MessageSquare, roles: ['Owner', 'Manager', 'Teacher'] },
    { name: 'Task Board', icon: CheckSquare, roles: ['Owner', 'Manager', 'Teacher'] },
    { name: 'Weekly Planner', icon: Calendar, roles: ['Owner', 'Manager'] },
    { name: 'Enquiries', icon: MessageSquare, roles: ['Owner', 'Manager', 'Teacher'] },
    { name: 'Demos', icon: GraduationCap, roles: ['Owner', 'Manager', 'Teacher'] },
    { name: 'Students', icon: Users, roles: ['Owner', 'Manager', 'Teacher'] },
    { name: 'Batches', icon: LayoutDashboard, roles: ['Owner', 'Manager', 'Teacher'] },
    { name: 'Attendance', icon: CheckSquare, roles: ['Owner', 'Manager', 'Teacher'] },
    { name: 'Fee Tracker', icon: Wallet, roles: ['Owner'] },
    { name: 'Notices', icon: Bell, roles: ['Owner', 'Manager', 'Teacher'] },
    { name: 'Performance', icon: BarChart3, roles: ['Owner'] },
  ];

  const filteredNav = navigation.filter(item => user && item.roles.includes(user.designation));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-primary text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <h1 className="text-xl font-bold font-display">TeachFlow</h1>
        <button onClick={() => setIsSidebarOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-primary text-white transform transition-transform duration-300 ease-in-out shadow-2xl
        md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-2xl font-bold font-display">TeachFlow</h1>
            <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
            {filteredNav.map((item) => (
              <button
                key={item.name}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${
                  currentView === item.name ? 'bg-secondary text-white' : 'hover:bg-white/10'
                }`}
                onClick={() => { onNavigate(item.name); setIsSidebarOpen(false); }}
              >
                <item.icon size={20} className={currentView === item.name ? 'text-white' : 'text-secondary group-hover:scale-110 transition-transform'} />
                <span className="font-medium text-sm">{item.name}</span>
                <ChevronRight size={14} className={`ml-auto transition-opacity ${currentView === item.name ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
              </button>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-white/10">
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-white shadow-inner">
                {user?.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold truncate text-sm">{user?.name}</p>
                <p className="text-[10px] text-secondary font-medium uppercase tracking-wider">{user?.designation}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative scroll-smooth">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>
        <AIChatbot />
      </main>
    </div>
  );
};
