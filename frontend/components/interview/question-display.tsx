export default function QuestionDisplay({ question }: { question: string }) {
  return (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-semibold font-headline tracking-tight text-foreground md:text-3xl">
        Your Question
      </h2>
      <p className="text-lg text-muted-foreground md:text-xl leading-relaxed">
        {question}
      </p>
    </div>
  );
}
