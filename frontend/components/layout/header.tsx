import Link from "next/link";
import { Bot } from "lucide-react";

export default function Header() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-background border-b">
      <Link href="/" className="flex items-center justify-center" prefetch={false}>
        <Bot className="h-6 w-6 text-primary" />
        <span className="ml-2 text-lg font-semibold font-headline">Interview Ace</span>
      </Link>
    </header>
  );
}