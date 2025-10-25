"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function FooterWrapper() {
  const pathname = usePathname();

  // Hide footer on login and signup pages
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return <Footer />;
}
