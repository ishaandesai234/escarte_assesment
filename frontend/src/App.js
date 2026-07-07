import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { installGlobalClickSound } from "@/lib/sounds";
import BackgroundMusic from "@/components/BackgroundMusic";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Quiz from "@/pages/Quiz";
import Results from "@/pages/Results";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";
import Foxy from "@/components/Foxy";

function Protected({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return <div className="min-h-screen flex items-center justify-center"><Foxy size={100} /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  useEffect(() => { installGlobalClickSound(); }, []);
  return (
    <AuthProvider>
      <BrowserRouter>
        <BackgroundMusic />
        <Toaster position="top-center" richColors />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/quiz/:category" element={<Protected><Quiz /></Protected>} />
          <Route path="/results/:id" element={<Protected><Results /></Protected>} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />
          <Route path="/admin" element={<Protected><Admin /></Protected>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
