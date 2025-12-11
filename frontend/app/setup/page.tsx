'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectItem, SelectValue, SelectContent } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Briefcase, Activity, AlertCircle, Pencil } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function InterviewSetupPage() {
  const router = useRouter();
  
  const [roleTitle, setRoleTitle] = useState(''); // Changed from 'role' to 'roleTitle'
  const [jobDescription, setJobDescription] = useState(''); // New state for JD
  const [difficulty, setDifficulty] = useState('Medium');
  const [isStarting, setIsStarting] = useState(false);

  const start = () => {
    // Validate that both Role Title and JD are provided
    if (!roleTitle || !jobDescription) return;

    setIsStarting(true);
    
    const sessionId = uuidv4();
    
    // Pass ALL custom parameters (Title, JD, Difficulty)
    router.push(
      `/room?session_id=${sessionId}` + 
      `&role=${encodeURIComponent(roleTitle)}` + 
      `&difficulty=${difficulty}` +
      `&jd=${encodeURIComponent(jobDescription)}` // New JD parameter
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      
      {/* Main Card */}
      <Card className="w-full max-w-lg shadow-xl border-slate-200 animate-in fade-in zoom-in duration-500">
        <CardHeader className="text-center space-y-2 pb-8">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <Briefcase className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">Configure Your Interview</CardTitle>
          <CardDescription className="text-slate-500 text-base">
            Customize the AI persona, job scope, and difficulty.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          
          {/* 1. Custom Role Title Input */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <Pencil className="h-4 w-4" /> Target Role Title
            </Label>
            <Input 
              placeholder="e.g., Senior TypeScript Developer, Cloud Architect" 
              className="h-12 text-base"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
            />
          </div>

          {/* 2. Job Description Input (New Feature) */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> Custom Job Description / Scope
            </Label>
            <Textarea 
              placeholder="Paste 3-4 key skills and responsibilities the job requires (e.g., Kubernetes, Python, ETL pipeline optimization, leadership)."
              rows={4}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> The AI will adapt its questions and expectations strictly based on this scope.
            </p>
          </div>

          {/* 3. Difficulty Selection (No change) */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" /> Difficulty Level
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {['Easy', 'Medium', 'Hard'].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`
                    py-2 px-4 rounded-md text-sm font-medium transition-all border
                    ${difficulty === level 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}
                  `}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <Button 
            size="xl" 
            onClick={start} 
            disabled={!roleTitle || !jobDescription || isStarting} 
            className="w-full text-lg font-semibold shadow-lg shadow-blue-200/50"
          >
            {isStarting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Setting up Room...
              </span>
            ) : (
              "Enter Interview Room"
            )}
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}