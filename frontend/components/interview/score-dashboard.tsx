'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BarChart, Bot, CheckCircle, Lightbulb, MessageSquare, Search, Star, Zap } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart as RechartsBarChart } from "recharts";
import type { EvaluateInterviewAnswerOutput } from "@/lib/types";

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


const rubricIcons: { [key: string]: React.ReactNode } = {
  technical_correctness: <Zap className="h-5 w-5 text-primary" />,
  problem_solving: <CheckCircle className="h-5 w-5 text-primary" />,
  communication: <MessageSquare className="h-5 w-5 text-primary" />,
  fluency: <Bot className="h-5 w-5 text-primary" />,
  confidence: <Star className="h-5 w-5 text-primary" />,
};

const rubricDisplayNames: { [key: string]: string } = {
  technical_correctness: "Technical Correctness",
  problem_solving: "Problem Solving",
  communication: "Communication",
  fluency: "Fluency",
  confidence: "Confidence",
  final_score: "Final Score",
};

export default function ScoreDashboard({ evaluation }: { evaluation: EvaluateInterviewAnswerOutput }) {
  const { scores, explainable_feedback, learning_plan } = evaluation;

  const chartData = Object.entries(scores)
    .filter(([key]) => key !== 'final_score')
    .map(([key, value]) => ({
      name: rubricDisplayNames[key] || key,
      score: value,
    }));
    
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <BarChart className="h-6 w-6" />
          Evaluation Results
        </CardTitle>
        <CardDescription>
          Here's the AI's feedback on your answer. Scores are out of 100.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Overall Scores</h3>
           <div className="h-[250px] w-full">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={120} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          {learning_plan && (
            <Card className="bg-secondary/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-headline">
                        <Lightbulb className="h-5 w-5"/>
                        Your Personalized Learning Plan
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">Areas to Improve:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            {learning_plan.improvement_points.map((point, i) => (
                                <li key={i}>{point}</li>
                            ))}
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-2">Suggested Learning Keywords:</h4>
                        <div className="flex flex-wrap gap-2">
                            {learning_plan.learning_resources_keywords.map((keyword, i) => (
                                <a key={i} href={`https://www.google.com/search?q=${encodeURIComponent(keyword)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-background border rounded-full px-3 py-1 text-sm hover:bg-accent transition-colors">
                                    <Search className="h-3.5 w-3.5" />
                                    {keyword}
                                </a>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Detailed Feedback</h3>
          <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
            {explainable_feedback.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-base font-medium hover:no-underline">
                  <div className="flex items-center gap-3">
                    {rubricIcons[item.rubric] || <Star className="h-5 w-5 text-primary" />}
                    <span>{rubricDisplayNames[item.rubric] || item.rubric}</span>
                    <span className="ml-auto pr-4 font-bold text-lg text-primary">{item.score}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-10 pt-2 space-y-3">
                  <p className="text-muted-foreground italic">"{item.comments}"</p>
                  {item.evidence && item.evidence.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm text-foreground/80">Evidence from your answer:</h4>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        {item.evidence.map((ev, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            "{ev}"
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </CardContent>
      <CardFooter className="bg-secondary/50 p-4 rounded-b-lg flex justify-center items-center">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Final Score</p>
          <p className="text-4xl font-bold text-primary">{Math.round(scores.final_score ?? 0)}</p>
        </div>
      </CardFooter>
    </Card>
  );
}
