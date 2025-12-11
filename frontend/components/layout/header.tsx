import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-background border-b">
      <Link href="/" className="flex items-center justify-center" prefetch={false}>
        
        <div className="relative h-10 w-40"> 
          <Image 
            src="/logo.png" 
            alt="Interview ACE Logo" 
            fill
            className="object-contain object-left"
            priority 
          />
        </div>
      </Link>
    </header>
  );
}
