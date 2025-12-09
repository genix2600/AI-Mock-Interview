import { Button } from "@/components/ui/button";
import { ArrowRight, LogOut } from "lucide-react";
import Link from "next/link";

interface InterviewControlsProps {
  onNextQuestion: () => void;
}

export default function InterviewControls({ onNextQuestion }: InterviewControlsProps) {
  return (
    <div className="mt-8 flex justify-center items-center gap-4">
      <Button variant="outline" asChild>
        <Link href="/">
          <LogOut className="mr-2 h-4 w-4" />
          End Session
        </Link>
      </Button>
      <Button onClick={onNextQuestion}>
        Next Question
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
