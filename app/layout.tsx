import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ToastProvider } from "@/components/providers/toaster-provider";
import { ConfettiProvider } from "@/components/providers/confetti-provider";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Edutrack",
  description: "Платформа навчання",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

/**
 * Top-level layout that wires up fonts, global providers, and shared chrome.
 *
 * @param {RootLayoutProps} props - Layout props.
 * @param {ReactNode} props.children - Page content to render.
 * @returns {JSX.Element} The rendered root layout.
 * @example
 * ```tsx
 * <RootLayout>
 *   <main>Content</main>
 * </RootLayout>
 * ```
 */
const RootLayout = ({ children }: RootLayoutProps): JSX.Element => {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ConfettiProvider />
          <ToastProvider />
          <div className="flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
