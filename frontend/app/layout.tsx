import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ContactModalProvider } from "@/contexts/ContactModalContext";
import { SnapScrollProvider } from "@/contexts/SnapScrollContext";
import { NavigationWrapper } from "@/components/navigation";
import { LayoutContent } from "@/components/layout/LayoutContent";
import { PageFadeOverlay } from "@/components/layout/PageFadeOverlay";
import { ContactModal } from "@/components/contact";
import { PersonSchema, WebSiteSchema } from "@/components/seo";
import { getThemeCookie } from "@/app/actions/theme";
import { homeSections } from "@/data/sections";
import { SITE_URL } from "@/lib/site-config";
import "./globals.scss";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | Florian Gagnaire",
    default: "Florian Gagnaire - Développeur Web Fullstack",
  },
  description:
    "Portfolio de Florian Gagnaire, développeur web fullstack en alternance. Projets React, Node.js, TypeScript.",
  keywords: [
    "développeur web",
    "fullstack",
    "react",
    "node.js",
    "typescript",
    "portfolio",
  ],
  authors: [{ name: "Florian Gagnaire" }],
  creator: "Florian Gagnaire",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = (await getThemeCookie()) ?? "dark";

  return (
    <html lang="fr" data-theme={theme}>
      <body className={`${inter.variable} ${geistMono.variable}`}>
        <a href="#main-content" className="skip-link">
          Aller au contenu principal
        </a>
        <PersonSchema />
        <WebSiteSchema />
        <ThemeProvider initialTheme={theme}>
          <ContactModalProvider>
            <SnapScrollProvider sections={homeSections}>
              <NavigationWrapper>
                <LayoutContent>
                  <main id="main-content">{children}</main>
                </LayoutContent>
              </NavigationWrapper>
              <PageFadeOverlay />
            </SnapScrollProvider>
            <ContactModal />
          </ContactModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
