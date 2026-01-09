import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppSettingsProvider } from "@/contexts/AppSettingsContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ReactQueryProvider } from "./providers";

const inter = Inter({ 
  subsets: ["latin"]
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
    <html lang="en" data-scroll-behavior="smooth">
      <body className={inter.className} suppressHydrationWarning={true}>
        <ReactQueryProvider>
          <AuthProvider>
            <NotificationProvider>
              <AppSettingsProvider>
                <Toaster />
                {children}
              </AppSettingsProvider>
            </NotificationProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}