import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EvaluateInterviewAnswerOutput } from "@/lib/types";
import { FileText } from "lucide-react";

interface TranscriptDisplayProps {
  transcript: string;
  feedback?: EvaluateInterviewAnswerOutput['explainable_feedback'];
}

export default function TranscriptDisplay({ transcript, feedback }: TranscriptDisplayProps) {
  const getHighlightedTranscript = () => {
    if (!feedback || feedback.length === 0) {
      return transcript;
    }

    let highlightedHtml = transcript;
    const allEvidence = feedback.flatMap(f => f.evidence).filter(Boolean);

    if (allEvidence.length > 0) {
      // Create a regex to find all evidence phrases
      const regex = new RegExp(`(${allEvidence.join('|')})`, 'gi');
      highlightedHtml = transcript.replace(regex, (match) => 
        `<mark class="bg-accent/30 text-accent-foreground rounded px-1">${match}</mark>`
      );
    }
    
    return highlightedHtml;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <FileText className="h-6 w-6" />
          Your Answer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="text-muted-foreground prose prose-lg max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: getHighlightedTranscript() }}
        />
      </CardContent>
    </Card>
  );
}