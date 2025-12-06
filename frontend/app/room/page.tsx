'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function InterviewRoomPage() {
  const router = useRouter();
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b p-4 flex justify-between">
        <h2>Interview Room</h2>
        <p>{timer}s</p>
        <Button onClick={() => router.push('/')}>End</Button>
      </div>

      <div className="flex flex-1">
        <div className="flex-1 p-6">
          <Card className="h-full bg-black">
            <CardContent className="text-white flex items-center justify-center h-full">
              AI Interviewer Feed
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="border-t p-6">
        <p className="text-lg font-medium">Sample Question</p>
      </div>
    </div>
  );
}