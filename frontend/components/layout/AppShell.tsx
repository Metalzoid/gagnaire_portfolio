"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { ContactModalProvider, useContactModal } from "@/contexts/ContactModalContext";
import { SnapScrollProvider } from "@/contexts/SnapScrollContext";
import { NavigationWrapper } from "@/components/navigation";
import { LayoutContent } from "@/components/layout/LayoutContent";
import { homeSections } from "@/data/sections";

const ContactModal = dynamic(
  () =>
    import("@/components/contact/ContactModal").then((m) => ({
      default: m.ContactModal,
    })),
  { ssr: false },
);

/** Monte le ContactModal uniquement à l'ouverture pour différer le chargement du chunk */
function ContactModalGate() {
  const { isOpen } = useContactModal();
  return isOpen ? <ContactModal /> : null;
}

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
        <ContactModalGate />
      </SnapScrollProvider>
    </ContactModalProvider>
  );
}
