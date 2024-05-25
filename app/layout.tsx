import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/providers";
import {Toaster} from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Skaners brand detector",
  description: "Brand detector",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Providers>
          <main
              className="flex min-h-screen flex-col items-center justify-between w-screen p-4 dark:bg-black bg-white dark:bg-grid-white/[0.2] bg-grid-black/[0.2]">
              <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"/>
              <Navbar/>
              <div className="container mx-auto px-4 py-8">
                  {children}
              </div>
          </main>
      </Providers>
      <Toaster/>
      </body>
    </html>
  );
}
