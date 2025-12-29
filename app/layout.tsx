import type { Metadata } from "next";
import { Oswald, Albert_Sans } from "next/font/google";

import "./globals.css";
import ThemePicker from "./components/ThemePicker";
import NavbarServer from "./components/NavbarServer";
import PageTransition from "./components/PageTransition";

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
        <NavbarServer />
        <PageTransition>{children}</PageTransition>
        <ThemePicker />
      </body>
    </html>
  );
}
