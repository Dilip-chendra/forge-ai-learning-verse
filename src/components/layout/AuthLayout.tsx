
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, BarChart3, Brain, Upload, Target, CheckSquare } from 'lucide-react';

export const AuthLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col bg-eduforge-purple text-white p-12 clip-path-slant relative overflow-hidden">
        <div className="absolute w-full h-full top-0 left-0 bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c')] opacity-10 mix-blend-overlay bg-cover"></div>
        <div className="z-10 flex items-center gap-2">
          <div className="bg-white text-eduforge-purple p-1.5 rounded-lg">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="text-2xl font-heading font-bold">EduForge<span className="text-white">AI</span></span>
        </div>
        
        <div className="z-10 mt-auto">
          <h1 className="text-4xl font-bold mb-4">AI-Powered Learning & Skill Companion</h1>
          <p className="text-lg opacity-90 mb-8">Revolutionize your learning journey with personalized AI assistance.</p>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Brain, text: "AI Study Generator" },
              { icon: Upload, text: "Upload-to-Learn Engine" },
              { icon: Target, text: "SkillForge Roadmaps" },
              { icon: BarChart3, text: "Progress Analytics" },
              { icon: CheckSquare, text: "Adaptive Quizzes" }
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <feature.icon className="w-5 h-5 text-eduforge-teal shrink-0" />
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="z-10 mt-8 text-sm opacity-70">
          ©2025 EduForge AI — The Future of Learning
        </div>
      </div>
      
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md p-8">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="bg-eduforge-purple text-white p-1.5 rounded-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-2xl font-heading font-bold">EduForge<span className="text-eduforge-purple">AI</span></span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
