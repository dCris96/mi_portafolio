import type { Metadata } from "next";
import { Oswald, Albert_Sans } from "next/font/google";

import "./globals.css";
import Navbar from "./components/Navbar";
import ThemePicker from "./components/ThemePicker";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-oswald",
});

const albertSans = Albert_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-albert-sans",
});

export const metadata: Metadata = {
  title: "Cristian's Portfolio",
  description: "Portfolio de Cristian Hernández, diseñador gráfico y web.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              const saved = localStorage.getItem('theme') || '';
              document.documentElement.setAttribute('data-theme', saved);
            })()
          `,
          }}
        />
      </head>
      <body className={`${oswald.variable} ${albertSans.variable}`}>
        <Navbar />
        {children}
        <ThemePicker />
      </body>
    </html>
  );
}
