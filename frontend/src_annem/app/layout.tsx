import './globals.css';

export const metadata = {
  title: "Mock Interview Platform",
  description: "AI-powered mock interviews."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
