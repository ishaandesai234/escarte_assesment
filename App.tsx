import { AuthProvider, useAuth } from './contexts/AuthContext';
import { EntryScreen } from './components/EntryScreen';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { TaskBoard } from './components/modules/TaskBoard';
import { WeeklyPlanner } from './components/modules/WeeklyPlanner';
import { Enquiries } from './components/modules/Enquiries';
import { Demos } from './components/modules/Demos';
import { Students } from './components/modules/Students';
import { Batches } from './components/modules/Batches';
import { AttendanceModule } from './components/modules/Attendance';
import { FeeTracker } from './components/modules/FeeTracker';
import { NoticeBoard } from './components/modules/NoticeBoard';
import { PerformanceOverview } from './components/modules/PerformanceOverview';
import { StaffChat } from './components/modules/StaffChat';
import { useState } from 'react';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState('Dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <EntryScreen />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'Dashboard': return <Dashboard onNavigate={setCurrentView} />;
      case 'Staff Chat': return <StaffChat />;
      case 'Task Board': return <TaskBoard />;
      case 'Weekly Planner': return <WeeklyPlanner />;
      case 'Enquiries': return <Enquiries />;
      case 'Demos': return <Demos />;
      case 'Students': return <Students />;
      case 'Batches': return <Batches />;
      case 'Attendance': return <AttendanceModule />;
      case 'Fee Tracker': return <FeeTracker />;
      case 'Notices': return <NoticeBoard />;
      case 'Performance': return <PerformanceOverview />;
      default: return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {renderView()}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
