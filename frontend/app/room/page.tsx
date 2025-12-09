'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, LogOut, BrainCircuit, AlertCircle } from 'lucide-react';
import RecordingComponent from '@/components/RecordingComponent'; 
import { fetchNextQuestion, sendAudioForTranscription } from '@/services/api'; 
import { InterviewRole } from '@/types/apiTypes'; 

// 1. Move the main logic into this inner component
function RoomContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id') || '';
  const role = searchParams.get('role') as InterviewRole || 'Data Analyst';
  
  // --- UI/API State ---
  const [question, setQuestion] = useState('Initializing AI Interface...');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // --- Timer Logic ---
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (isComplete) return;
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isComplete]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- CORE INTEGRATION LOGIC ---

  const handleStartSession = useCallback(async () => {
    if (!sessionId) {
      setError("No Session ID provided.");
      return;
    }
    setIsProcessing(true);
    
    try {
      // 1. Initial Call (Start Session)
      const response = await fetchNextQuestion({ session_id: sessionId, user_id: 'guest', role, user_answer: null });
      setQuestion(response.ai_question);
      setIsComplete(response.is_complete);
    } catch (err) {
      console.error(err);
      setError('Connection failed. Is the backend running?');
    } finally {
      setIsProcessing(false);
    }
  }, [sessionId, role]);

  // Start session on mount
  useEffect(() => {
    handleStartSession();
  }, [handleStartSession]);

  
  const handleRecordingComplete = useCallback(async (base64Audio: string) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // 1. Transcribe Audio
      const transcribeResponse = await sendAudioForTranscription({ session_id: sessionId, audio_data_uri: base64Audio });
      const transcript = transcribeResponse.transcript;
      
      // 2. Get Next Question (or End Session)
      const nextQuestionResponse = await fetchNextQuestion({
        session_id: sessionId,
        user_id: 'guest', 
        role,
        user_answer: transcript 
      });

      setQuestion(nextQuestionResponse.ai_question);
      setIsComplete(nextQuestionResponse.is_complete);
      
    } catch (err) {
      console.error(err);
      setError('Failed to process answer. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [sessionId, role]);


  const handleEndInterview = () => {
    router.push(`/interview/feedback?session_id=${sessionId}&role=${encodeURIComponent(role)}`);
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full border border-red-100 text-xs font-bold uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Live Session
          </div>
          <h1 className="text-lg font-semibold text-slate-800 hidden md:block">{role} Interview</h1>
        </div>

        <div className="flex items-center gap-2 text-slate-500 bg-slate-100 px-4 py-2 rounded-md font-mono text-sm font-medium">
          <Clock className="h-4 w-4" />
          {formatTime(seconds)}
        </div>

        <Button variant="destructive" size="sm" onClick={handleEndInterview}>
          <LogOut className="h-4 w-4 mr-2" /> End
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        
        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* AI Persona Card */}
        <Card className="flex-1 bg-slate-900 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
          
          <CardContent className="relative z-10 flex flex-col items-center text-center space-y-8 p-8 max-w-2xl">
            {/* Visualizer */}
            <div className="relative">
              {isProcessing && <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl animate-pulse" />}
              <div className={`h-24 w-24 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-inner border border-white/10 ${isProcessing ? 'animate-bounce' : ''}`}>
                <BrainCircuit className="h-12 w-12 text-white" />
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-4">
              <p className="text-slate-400 text-sm uppercase tracking-widest font-semibold">
                {isProcessing ? 'AI is thinking...' : 'AI Interviewer asking:'}
              </p>
              <h2 className="text-2xl md:text-3xl font-medium text-white leading-relaxed">
                "{question}"
              </h2>
            </div>
          </CardContent>
        </Card>

        {/* User Interaction Area */}
        <Card className="border-t-4 border-blue-500 shadow-lg bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider">
              {isComplete ? 'Session Finished' : 'Your Turn to Speak'}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pb-6">
            
            {isComplete ? (
               <Button onClick={handleEndInterview} size="lg" className="w-full max-w-md bg-green-600 hover:bg-green-700 text-lg py-6">
                 View Final Results
               </Button>
            ) : (
               <div className="w-full max-w-md">
                 <RecordingComponent 
                   onRecordingComplete={handleRecordingComplete} 
                   disabled={isProcessing} 
                 />
                 <p className="text-center text-xs text-slate-400 mt-3">
                   {isProcessing ? 'Analyzing audio...' : 'Click to start recording. Click again to submit.'}
                 </p>
               </div>
            )}
            
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

// 2. The default export now wraps everything in Suspense
export default function InterviewRoomPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <BrainCircuit className="h-12 w-12 text-blue-500 animate-pulse" />
          <p className="text-slate-500 font-medium animate-pulse">Connecting to Interview Room...</p>
        </div>
      </div>
    }>
      <RoomContent />
    </Suspense>
  );
}