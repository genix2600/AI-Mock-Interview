'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectItem, SelectValue, SelectContent } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';

export default function InterviewSetupPage() {
  const router = useRouter();
  const [interviewType, setInterviewType] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [mode, setMode] = useState('timed');

  const start = () => {
    router.push(`/interview/room?type=${interviewType}&difficulty=${difficulty}&mode=${mode}`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto mt-12">
        <CardHeader>
          <CardTitle>Interview Setup</CardTitle>
          <CardDescription>Choose preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Interview Type</Label>
            <Select onValueChange={setInterviewType}>
              <SelectTrigger><SelectValue placeholder="Choose type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="behavioral">Behavioral</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button size="lg" onClick={start} className="w-full">Start Interview</Button>
        </CardContent>
      </Card>
    </div>
  );
}
