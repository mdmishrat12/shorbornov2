import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/providers/SidebarProvider";
import AuthProvider from "./providers/AuthProvider";
import QueryProvider from "@/providers/queryProvider";
import { Navigation } from "lucide-react";
import { Toaster } from "@/components/ui/sooner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shorborno - BCS Preparation",
  description: "Your ultimate BCS exam preparation platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
       <QueryProvider>
          <AuthProvider>
            <SidebarProvider>
              <Navigation />
              {children}
              <Toaster position="top-right" />
            </SidebarProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}