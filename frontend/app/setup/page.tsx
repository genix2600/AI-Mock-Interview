'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid'; // Ensure you have: npm install uuid @types/uuid
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectItem, SelectValue, SelectContent } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Briefcase, Activity, AlertCircle } from 'lucide-react';

export default function InterviewSetupPage() {
  const router = useRouter();
  
  // State for form selection
  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [isStarting, setIsStarting] = useState(false);

  const start = () => {
    if (!role) return;

    setIsStarting(true);
    
    // 1. Generate Unique Session ID (Critical for Backend)
    const sessionId = uuidv4();
    
    // 2. Navigate to Room with Params
    // We pass 'role' and 'session_id' so the Room can initialize the AI
    router.push(`/room?session_id=${sessionId}&role=${encodeURIComponent(role)}&difficulty=${difficulty}`);
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
            Customize the AI persona and difficulty level.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          
          {/* Role Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> Target Role
            </Label>
            <Select onValueChange={setRole}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select a position..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Data Analyst">Data Analyst</SelectItem>
                <SelectItem value="ML Engineer">Machine Learning Engineer</SelectItem>
                <SelectItem value="Cybersecurity Analyst">Cybersecurity Analyst</SelectItem>
                <SelectItem value="Software Engineer">Software Engineer</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> The AI will adapt technical questions to this role.
            </p>
          </div>

          {/* Difficulty Selection (Visual only for now, can be passed to backend later) */}
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
            disabled={!role || isStarting} 
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