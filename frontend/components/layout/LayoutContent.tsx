"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";

interface LayoutContentProps {
  children: React.ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <Footer />
    </>
  );
}
