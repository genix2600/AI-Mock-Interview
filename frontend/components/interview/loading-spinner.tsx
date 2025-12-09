import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-lg text-muted-foreground">{message}</p>
    </div>
  );
}
