'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-4xl font-bold">Mock Interview Platform</h1>
      <Button asChild size="lg">
        <Link href="/setup">Start Interview</Link>
      </Button>
    </main>
  );
}