import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NavigationWrapper } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { getThemeCookie } from "@/app/actions/theme";
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
          <NavigationWrapper>
            <main id="main-content">{children}</main>
            <Footer />
          </NavigationWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
