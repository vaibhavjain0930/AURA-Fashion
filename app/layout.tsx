import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import MUIThemeProvider from "@/components/Providers/MUIThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Aura | AI-Powered Luxury Fashion",
  description: "Experience premium fashion with AI virtual try-on.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <Toaster position="bottom-right" toastOptions={{ 
            style: { 
              background: 'var(--card)',
              color: 'var(--foreground)',
              border: '1px solid rgba(128,128,128,0.2)'
            }
        }} />
        <MUIThemeProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </MUIThemeProvider>
      </body>
    </html>
  );
}
