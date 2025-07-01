import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Fakebook",
  description: "I'm lovin' it!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
