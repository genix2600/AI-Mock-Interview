'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ScoreVisualization from '@/components/ScoreVisualization'; 
import { fetchEvaluation } from '@/services/api';
import { EvaluationReport } from '@/types/apiTypes';

// 1. Move the main logic into this inner component
function FeedbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const role = searchParams.get('role') || 'Candidate';

  const [report, setReport] = useState<EvaluationReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getEvaluation = async () => {
      if (!sessionId) {
        setError("No Session ID found.");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchEvaluation({
          session_id: sessionId,
          role: role,
          full_transcript: "SESSION_HISTORY_FROM_DB" 
        });
        
        setReport(data);
      } catch (err) {
        console.error("Evaluation Failed:", err);
        setError("Failed to generate feedback report. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getEvaluation();
  }, [sessionId, role]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
        
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900">Interview Analysis</h1>
        <p className="text-lg text-slate-600">
          Role: <span className="font-semibold text-blue-600">{role}</span>
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <Card className="h-64 flex items-center justify-center">
          <CardContent className="text-center space-y-4">
            <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-500 animate-pulse">
              AI is analyzing your technical accuracy and communication...
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-500 bg-red-50">
          <CardContent className="p-6 text-center text-red-700">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
            <Button 
              variant="outline" 
              className="mt-4 border-red-200 hover:bg-red-100"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Success State: Render Visualization */}
      {!loading && !error && report && (
        <ScoreVisualization report={report} />
      )}

      {/* Navigation Actions */}
      <div className="flex justify-center gap-4 pt-8">
        <Button 
          onClick={() => router.push('/')} 
          variant="secondary" 
          size="lg"
          className="shadow-sm"
        >
          Back to Home
        </Button>
        <Button 
          onClick={() => router.push('/interview/setup')} 
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 shadow-md"
        >
          Start New Interview
        </Button>
      </div>

    </div>
  );
}

// 2. The default export now wraps everything in Suspense
export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <Suspense fallback={
        <div className="h-64 flex items-center justify-center">
          <div className="text-slate-500 animate-pulse">Loading feedback report...</div>
        </div>
      }>
        <FeedbackContent />
      </Suspense>
    </div>
  );
}