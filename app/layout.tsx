import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unified Inbox | AI Marketing via WhatsApp & SMS",
  description: "Generate AI-powered marketing messages and send via WhatsApp or SMS.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-white text-ink-900 antialiased">{children}</body>
    </html>
  );
}
