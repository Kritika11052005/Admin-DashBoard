import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import { ThemeProvider } from "@/lib/ThemeContext";
import { LoadingProvider } from "@/lib/LoadingProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AariyaTech Analytics Dashboard",
  description: "Full-Stack Admin Analytics Dashboard with Next.js, TypeScript, and MongoDB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <LoadingProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}