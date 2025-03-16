import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Old_Standard_TT } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import Navigation from "./_components/Navigation";

import { TRPCReactProvider } from "~/trpc/react";

const oldStandardTT = Old_Standard_TT({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-old-standard",
});

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Orchid Visualizer",
  description: "A piano learning app",
  metadataBase: new URL("https://orchid.synthsonic.app"),
  authors: [{ name: "Orchid" }],
  openGraph: {
    title: "Orchid Visualizer",
    description:
      "An interactive MIDI piano keyboard for exploring chord voicings and harmonies. Connect your MIDI device and start playing!",
    type: "website",
    siteName: "Orchid Visualizer",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Orchid Visualizer",
    description:
      "An interactive MIDI piano keyboard for exploring chord voicings and harmonies. Connect your MIDI device and start playing!",
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a1a1a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${oldStandardTT.variable} ${inter.className}`}
    >
      <body className="min-h-screen bg-gradient-to-b from-black via-[#1a1a1a] to-black text-white">
        <TRPCReactProvider>
          <Navigation />
          {children}
        </TRPCReactProvider>
        <Analytics />
      </body>
    </html>
  );
}
