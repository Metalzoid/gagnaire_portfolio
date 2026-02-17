"use client";

import { usePathname } from "next/navigation";
import { ContactModalProvider } from "@/contexts/ContactModalContext";
import { SnapScrollProvider } from "@/contexts/SnapScrollContext";
import { NavigationWrapper } from "@/components/navigation";
import { LayoutContent } from "@/components/layout/LayoutContent";
import { PageFadeOverlay } from "@/components/layout/PageFadeOverlay";
import { ContactModal } from "@/components/contact";
import { homeSections } from "@/data/sections";

/** Masque la navigation et le footer pour les routes /admin */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <ContactModalProvider>
      <SnapScrollProvider sections={homeSections}>
        <NavigationWrapper>
          <LayoutContent>
            <main id="main-content">{children}</main>
          </LayoutContent>
        </NavigationWrapper>
        <PageFadeOverlay />
        <ContactModal />
      </SnapScrollProvider>
    </ContactModalProvider>
  );
}
