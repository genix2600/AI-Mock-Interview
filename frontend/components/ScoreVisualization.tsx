'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EvaluationReport } from '@/types/apiTypes';

interface ScoreVisualizationProps {
  report: EvaluationReport;
}

export default function ScoreVisualization({ report }: ScoreVisualizationProps) {
  
  // Helper to determine color based on score (0-10)
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressWidth = (score: number) => `${(score / 10) * 100}%`;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ScoreCard 
          title="Technical Accuracy" 
          score={report.technical_score} 
          colorClass="bg-blue-500"
          description="Knowledge & Correctness"
        />
        <ScoreCard 
          title="Communication Clarity" 
          score={report.clarity_score} 
          colorClass="bg-emerald-500"
          description="Structure & Conciseness"
        />
        <ScoreCard 
          title="Fluency & Confidence" 
          score={report.fluency_score} 
          colorClass="bg-purple-500"
          description="Pacing & Flow"
        />
      </div>

      {/* 2. Strengths & Weaknesses Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths */}
        <Card className="border-l-4 border-green-500 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {report.technical_strengths.length > 0 ? (
                report.technical_strengths.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-500" />
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <p className="text-slate-400 italic">No specific strengths highlighted.</p>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-amber-500 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {report.technical_weaknesses.length > 0 ? (
                report.technical_weaknesses.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <p className="text-slate-400 italic">No specific weaknesses found.</p>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* 3. Detailed Feedback Block */}
      <Card className="bg-slate-50 border border-slate-200">
        <CardHeader>
          <CardTitle>Detailed Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-slate-800 leading-relaxed whitespace-pre-line">
            {report.detailed_feedback}
          </p>
        </CardContent>
      </Card>

    </div>
  );
}

// --- Sub-Component for Score Cards ---
function ScoreCard({ title, score, colorClass, description }: { title: string, score: number, colorClass: string, description: string }) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6 flex flex-col items-center text-center z-10 relative">
        <div className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">
          {title}
        </div>
        <div className="text-5xl font-extrabold text-slate-900 mb-1">
          {score}<span className="text-2xl text-slate-400 font-medium">/10</span>
        </div>
        <div className="text-xs text-slate-400 mb-4">{description}</div>
        
        {/* Simple visual progress bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className={`h-full ${colorClass}`} 
            style={{ width: `${(score / 10) * 100}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}