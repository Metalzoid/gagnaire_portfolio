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
import { getThemeCookie } from "@/app/actions/theme";
import { homeSections } from "@/data/sections";
import "./globals.scss";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Gagnaire Florian - Développeur Full Stack",
  description:
    "Portfolio professionnel de Gagnaire Florian, développeur full stack",
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
