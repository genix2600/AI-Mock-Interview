'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge'; // Run: npx shadcn-ui@latest add badge
import { Mic, Clock, LogOut, BrainCircuit } from 'lucide-react';
import RecordingComponent from '@/components/RecordingComponent'; // Your existing component

export default function InterviewRoomPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'Candidate';
  
  // Timer Logic
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format time as MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndSession = () => {
    // In the real app, this will navigate to /interview/feedback
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* 1. Header Bar */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
        
        {/* Left: Role & Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full border border-red-100 text-xs font-bold uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Live Session
          </div>
          <h1 className="text-lg font-semibold text-slate-800 hidden md:block">
            {role} Interview
          </h1>
        </div>

        {/* Center: Timer */}
        <div className="flex items-center gap-2 text-slate-500 bg-slate-100 px-4 py-2 rounded-md font-mono text-sm font-medium">
          <Clock className="h-4 w-4" />
          {formatTime(seconds)}
        </div>

        {/* Right: End Button */}
        <Button variant="destructive" size="sm" onClick={handleEndSession}>
          <LogOut className="h-4 w-4 mr-2" /> End
        </Button>
      </header>

      {/* 2. Main Visualizer Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        
        {/* AI Persona Card */}
        <Card className="flex-1 bg-slate-900 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
          
          {/* Animated Background Glow */}
          <div className="absolute inset-0 bg-linear-to-b from-blue-500/10 to-transparent pointer-events-none" />
          
          <CardContent className="relative z-10 flex flex-col items-center text-center space-y-8 p-8 max-w-2xl">
            
            {/* The "AI Brain" Visualizer */}
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="h-24 w-24 bg-linear-to-tr from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-inner border border-white/10">
                <BrainCircuit className="h-12 w-12 text-white" />
              </div>
            </div>

            {/* The Question Text */}
            <div className="space-y-4">
              <p className="text-slate-400 text-sm uppercase tracking-widest font-semibold">
                AI Interviewer asking:
              </p>
              <h2 className="text-2xl md:text-3xl font-medium text-white leading-relaxed">
                "Can you walk me through a challenging project where you had to optimize a machine learning model for production?"
              </h2>
            </div>

          </CardContent>
        </Card>

        {/* 3. User Interaction Area */}
        <Card className="border-t-4 border-blue-500 shadow-lg bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Your Turn to Speak
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pb-6">
            
            {/* This is where your RecordingComponent will live.
               For now, we mock the UI so you see how it fits.
            */}
            <div className="w-full max-w-md">
               {/* <RecordingComponent ... /> */}
               <Button size="xl" className="w-full h-16 text-lg rounded-full shadow-xl shadow-blue-200/50 transition-all hover:scale-105 active:scale-95">
                 <Mic className="h-6 w-6 mr-2" /> Start Recording Answer
               </Button>
               <p className="text-center text-xs text-slate-400 mt-3">
                 Click to start speaking. Click again to submit.
               </p>
            </div>

          </CardContent>
        </Card>

      </main>
    </div>
  );
}