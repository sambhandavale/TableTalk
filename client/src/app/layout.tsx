import type { Metadata } from "next";
import { Sora, League_Gothic } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

const leagueGothic = League_Gothic({
  subsets: ["latin"],
  variable: "--font-league-gothic",
});

export const metadata: Metadata = {
  title: "TableTalk | AI-Powered Customer Intelligence & Retention",
  description: "Turn offline business feedback into online growth with automated Google Review audits, smart QR-based private review routing, and AI-driven retention loops.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${leagueGothic.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0b0c10] text-gray-100 font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

