import './globals.css';

export const metadata = {
  title: "Mock Interview Platform",
  description: "AI-powered mock interviews."
};

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}