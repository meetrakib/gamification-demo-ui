import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gamification Demo",
  description: "Demo UI for gamification-core API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
