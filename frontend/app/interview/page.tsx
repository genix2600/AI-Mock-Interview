'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RecordingComponent from '@/components/RecordingComponent'; 

// 1. We move the main logic into this inner component
function InterviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'Candidate';
  const sessionId = searchParams.get('session_id');

  // UI State
  const [question, setQuestion] = useState("Welcome! I'm your AI interviewer. To get started, could you please tell me about a challenging project you've worked on recently?");
  const [isProcessing, setIsProcessing] = useState(false);

  // This function will eventually talk to the backend
  const handleRecordingComplete = (base64Audio: string) => {
    setIsProcessing(true);
    console.log("Audio captured! (Integration pending...)");
    
    // Simulate API delay for UI testing
    setTimeout(() => {
      setIsProcessing(false);
      setQuestion("That's interesting. Can you explain the technical trade-offs you had to make during that phase?");
    }, 2000);
  };

  const handleEndInterview = () => {
    router.push(`/interview/feedback?session_id=${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
          <h1 className="font-semibold text-slate-800">Live Interview: {role}</h1>
        </div>
        <Button variant="outline" onClick={handleEndInterview}>
          End Interview
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 flex flex-col gap-6">
        
        {/* AI Persona / Visualizer */}
        <Card className="flex-1 bg-slate-900 border-none shadow-lg overflow-hidden relative">
          <CardContent className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-2xl animate-bounce">
              <span className="text-4xl">🤖</span>
            </div>
            {isProcessing ? (
              <p className="text-slate-300 text-xl animate-pulse">Processing your answer...</p>
            ) : (
              <h2 className="text-2xl md:text-3xl font-medium text-white leading-relaxed">
                "{question}"
              </h2>
            )}
          </CardContent>
        </Card>

        {/* User Controls Area */}
        <Card className="border-t-4 border-blue-500 shadow-md">
          <CardHeader>
            <CardTitle className="text-center text-sm uppercase tracking-wide text-slate-500">
              Your Turn to Speak
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <RecordingComponent 
              onRecordingComplete={handleRecordingComplete} 
              disabled={isProcessing} 
            />
          </CardContent>
        </Card>

      </main>
    </div>
  );
}

// 2. The default export now wraps the content in Suspense
export default function InterviewRoomPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 animate-pulse">Loading interview environment...</p>
      </div>
    }>
      <InterviewContent />
    </Suspense>
  );
}