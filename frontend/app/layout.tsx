import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // <--- THIS IMPORT IS CRITICAL

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Interviewer",
  description: "Ace your next technical interview",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}