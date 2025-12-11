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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* 1. Original Score Visualization */}
            <ScoreVisualization report={report} />
            <div className="grid gap-6 md:grid-cols-2">
            
                {/* Improvement Plan Card */}
                <Card className="border-l-4 border-l-amber-500 shadow-md bg-white">
                    <CardContent className="p-6">
                    <h3 className="mb-4 text-xl font-bold text-slate-800 flex items-center gap-2">
                         Action Plan
                    </h3>
                    <ul className="space-y-3">
                        {report.improvement_plan && report.improvement_plan.length > 0 ? (
                            report.improvement_plan.map((step, idx) => (
                                <li key={idx} className="flex gap-3 text-slate-700">
                                    <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-700 font-bold text-xs">
                                    {idx + 1}
                                    </span>
                                    <span className="text-sm font-medium leading-tight pt-1">{step}</span>
                                </li>
                            ))
                        ) : (
                            <p className="text-slate-400 italic">No specific plan generated.</p>
                        )}
                    </ul>
                    </CardContent>
                </Card>

                {/* Learning Resources Card */}
                <Card className="border-l-4 border-l-blue-500 shadow-md bg-white">
                    <CardContent className="p-6">
                    <h3 className="mb-4 text-xl font-bold text-slate-800 flex items-center gap-2">
                         Recommended Study
                    </h3>
                    <ul className="space-y-3">
                        {report.learning_resources && report.learning_resources.length > 0 ? (
                            report.learning_resources.map((res, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-slate-700">
                                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                    <a 
                                        href={`https://www.google.com/search?q=${encodeURIComponent(res)}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium hover:text-blue-600 hover:underline transition-colors leading-tight"
                                    >
                                        {res} 
                                        <span className="ml-1 text-xs text-slate-400 inline-block align-top">↗</span>
                                    </a>
                                </li>
                            ))
                        ) : (
                            <p className="text-slate-400 italic">No resources suggested.</p>
                        )}
                    </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
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