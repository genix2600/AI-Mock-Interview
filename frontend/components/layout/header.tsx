import Link from "next/link";
import { Bot, Github } from "lucide-react"; // 1. Import the Github icon

export default function Header() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-background border-b">
      {/* Brand / Logo */}
      <Link href="/" className="flex items-center justify-center" prefetch={false}>
        <Bot className="h-6 w-6 text-primary" />
        <span className="ml-2 text-lg font-semibold font-headline">Interview Ace</span>
      </Link>
      <Link 
        href="https://github.com/genix2600/AI-Mock-Interview"
        target="_blank" 
        rel="noopener noreferrer"
        className="ml-auto flex items-center gap-2 hover:text-primary transition-colors"
        prefetch={false}
      >
        <span className="hidden md:block text-sm font-medium">GitHub Repo</span>
        <Github className="h-5 w-5" />
      </Link>
    </header>
  );
}