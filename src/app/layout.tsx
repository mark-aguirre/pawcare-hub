import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactQueryProvider } from "./providers";
import { AppSettingsProvider } from "@/contexts/AppSettingsContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ResourcePreloader } from "@/lib/preload";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true
});

export const metadata: Metadata = {
  title: "PawCare Hub",
  description: "Veterinary practice management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className={inter.className}>
        <ResourcePreloader>
          <ReactQueryProvider>
            <AuthProvider>
              <NotificationProvider>
                <AppSettingsProvider>
                  <TooltipProvider>
                    <LoadingSpinner />
                    <Toaster />
                    <Sonner />
                    {children}
                  </TooltipProvider>
                </AppSettingsProvider>
              </NotificationProvider>
            </AuthProvider>
          </ReactQueryProvider>
        </ResourcePreloader>
      </body>
    </html>
  );
}