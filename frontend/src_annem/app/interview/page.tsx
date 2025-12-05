import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function FeedbackPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl">
      <h1 className="text-4xl font-bold">Interview Feedback</h1>

      <Card className="mt-10">
        <CardContent className="p-6 space-y-4">
          <p>Strengths: Clear communication.</p>
          <p>Areas to improve: Technical depth.</p>

          <Button asChild className="w-full mt-4">
            <Link href="/interview/setup">Try Again</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
