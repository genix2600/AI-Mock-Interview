'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Bot, BrainCircuit, Mic, Code2, BarChart3 } from 'lucide-react';
// Assuming '@/components/layout/header' is your basic Navbar
import Header from '@/components/layout/header'; 

// Helper Component for Feature Cards (taken from your second snippet)
function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 bg-background">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          {icon}
        </div>
        <CardTitle className="text-xl font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Header (Navbar component) */}
      <Header />
      
      <main className="flex-1">
        
        {/* 2. Hero Section (Taken from first snippet, improved) */}
        <section className="w-full py-20 md:py-32 lg:py-40 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
              
              {/* Left Column: Text and CTA */}
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  
                  {/* Gemini Badge (Taken from second snippet) */}
                  <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-800 mb-2">
                    <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
                    Powered by **Gemini 2.5 Flash**
                  </div>
                  
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Ace Your Next Tech Interview with AI
                  </h1>
                  
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Practice with an AI that listens, understands, and evaluates you in real-time. Get instant feedback on your technical accuracy, clarity, and fluency.
                    wsg kriti
                  </p>
                </div>
                
                {/* CTA Buttons */}
                <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
                  <Button asChild size="lg" className="h-14 px-8 text-lg shadow-lg shadow-primary/20 group">
                    {/* Link path updated to /interview/setup */}
                    <Link href="/interview/setup"> 
                      Start Mock Interview
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg">
                    <Link href="#features">Learn More</Link>
                  </Button>
                </div>
              </div>
              
              {/* Right Column: Visualizer */}
              <div className="hidden lg:block relative h-full">
                <div className="relative flex items-center justify-center h-full">
                  {/* Subtle Background Glow */}
                  <div className="absolute inset-0 top-1/4 bg-primary/10 rounded-full blur-3xl opacity-75 animate-pulse-slow"></div>
                  {/* Large Bot Icon */}
                  <Bot className="relative w-4/5 h-auto text-primary/80 opacity-90" size={400} strokeWidth={0.5} />
                </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* 3. Features Grid (Taken from second snippet, using first snippet's Card style) */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Why Interview Ace Helps You Succeed</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform is powered by the Gemini 2.5 Flash API to provide the most realistic, comprehensive, and tailored interview practice available.
                </p>
              </div>
            </div>
            
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              <FeatureCard 
                icon={<BrainCircuit className="h-6 w-6 text-primary" />}
                title="AI-Powered Context"
                description="Get a tailored set of questions based on your desired **role and difficulty** level, ensuring you're prepared for what's to come."
              />
              <FeatureCard 
                icon={<Mic className="h-6 w-6 text-primary" />}
                title="Speech-to-Text Analysis"
                description="Speak naturally. Our platform transcribes your spoken answers in real-time, providing the basis for detailed performance analysis."
              />
              <FeatureCard 
                icon={<BarChart3 className="h-6 w-6 text-primary" />}
                title="Structured Evaluation"
                description="Receive scores and actionable feedback on technical correctness, clarity, and problem-solving skills immediately after finishing."
              />
            </div>
          </div>
        </section>
      </main>
      
      {/* 4. Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-background">
        <p className="text-xs text-muted-foreground">&copy; 2025 Interview Ace. Built for Techfest IIT Bombay.</p>
      </footer>
      
    </div>
  );
}