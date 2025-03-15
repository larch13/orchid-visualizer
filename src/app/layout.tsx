import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Old_Standard_TT } from "next/font/google";
import { type Metadata } from "next";
import { Analytics } from '@vercel/analytics/react';
import { Inter } from "next/font/google";
import Footer from "./_components/Footer";

import { TRPCReactProvider } from "~/trpc/react";

const oldStandardTT = Old_Standard_TT({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-old-standard',
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Orchid",
  description: "A piano learning app",
  metadataBase: new URL('https://orchid-voicing.vercel.app'),
  authors: [{ name: 'Orchid' }],
  openGraph: {
    title: 'Orchid Voicing Viewer',
    description: 'An interactive MIDI piano keyboard for exploring chord voicings and harmonies. Connect your MIDI device and start playing!',
    type: 'website',
    siteName: 'Orchid Voicing Viewer',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Orchid Voicing Viewer',
    description: 'An interactive MIDI piano keyboard for exploring chord voicings and harmonies. Connect your MIDI device and start playing!',
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a1a1a',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${oldStandardTT.variable} ${inter.className}`}>
      <body className="min-h-screen bg-gradient-to-b from-black via-[#1a1a1a] to-black text-white">
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Analytics />
        <Footer />
      </body>
    </html>
  );
}
