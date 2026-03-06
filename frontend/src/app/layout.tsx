import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { RoleProvider } from "@/lib/role-context";
import { AuthProvider } from "@/lib/auth-context";
import { Sidebar } from "@/components/Sidebar";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ERP Suite",
  description: "Sistema ERP enterprise cloud-native",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen antialiased`}
      >
        <AuthProvider>
          <RoleProvider>
            <Toaster position="top-right" />
            <Sidebar />
            <main className="flex-1 overflow-auto bg-white dark:bg-zinc-950">
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
          </RoleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
