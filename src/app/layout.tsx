import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Sanatorio San Juan",
    template: "%s | Sanatorio San Juan",
  },
  description:
    "Sanatorio San Juan: Confort, tecnología y servicios 24hs. Especialidades, internación, guardia pediátrica y turnos online.",
  metadataBase: new URL("https://sanatoriosanjuan.com"),
  applicationName: "Sanatorio San Juan",
  openGraph: {
    title: "Sanatorio San Juan",
    description:
      "Confort, tecnología y servicios 24hs. Especialidades, internación, guardia pediátrica y turnos online.",
    type: "website",
    locale: "es_AR",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
