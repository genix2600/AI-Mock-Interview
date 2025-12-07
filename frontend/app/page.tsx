'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, BarChart3, Code2, ArrowRight, BrainCircuit } from 'lucide-react'; // Icons

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white flex flex-col">
      
      {/* 1. Navbar / Header */}
      <header className="px-6 py-4 flex justify-between items-center border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
          <BrainCircuit className="text-blue-600" />
          <span>AI Interviewer</span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
          <Link href="#features" className="hover:text-blue-600 transition">Features</Link>
          <Link href="#how-it-works" className="hover:text-blue-600 transition">How it Works</Link>
        </nav>
        <div className="flex gap-4">
          <Button variant="ghost" asChild>
            <Link href="https://github.com/genix2600/AI-Mock-Interview" target="_blank">GitHub</Link>
          </Button>
          <Button asChild>
            <Link href="/setup">Get Started</Link>
          </Button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 lg:py-32">
        <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-800">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
            Powered by Gemini 2.5 Flash
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
            Master Your Next <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">
              Technical Interview
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Practice with an AI that listens, understands, and evaluates you in real-time. 
            Get instant feedback on your technical accuracy, clarity, and fluency.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button asChild size="xl" className="h-14 px-8 text-lg shadow-lg shadow-blue-200/50">
              <Link href="/setup">
                Start Mock Interview <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="h-14 px-8 text-lg">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* 3. Features Grid */}
      <section id="features" className="bg-slate-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Why Practice with Us?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Mic className="h-10 w-10 text-blue-500" />}
              title="Voice-First AI"
              description="Speak naturally. Our multimodal AI listens to your audio directly, analyzing not just what you say, but how you say it."
            />
            <FeatureCard 
              icon={<Code2 className="h-10 w-10 text-purple-500" />}
              title="Role-Specific Context"
              description="Select from Data Analyst, ML Engineer, or Cybersecurity roles. The AI adapts its questions to your specific domain."
            />
            <FeatureCard 
              icon={<BarChart3 className="h-10 w-10 text-green-500" />}
              title="Structured Evaluation"
              description="Receive a detailed JSON-based report card scoring your technical accuracy, clarity, and fluency immediately after finishing."
            />
          </div>
        </div>
      </section>

      {/* 4. Footer */}
      <footer className="bg-white border-t py-8 text-center text-slate-500 text-sm">
        <p>© 2025 Fantastic Four. Built for UpSkill India Challenge (Techfest IIT Bombay).</p>
      </footer>
    </div>
  );
}

// Helper Component for Feature Cards
function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="mb-4 inline-block rounded-lg bg-slate-100 p-3 w-fit">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600 leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}