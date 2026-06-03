"use client";

import { usePathname } from "next/navigation";
import { ShopProvider } from "./context/shop-context";
import { MiniCartDrawer, ToastStack } from "./components/shop-ui";
import { Navbar } from "./components/navbar";
import { TaraChatWidget } from "./components/tara-chat";

const LANDING_ROUTES = ["/waitlist"];

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = LANDING_ROUTES.some((route) => pathname?.startsWith(route));

  return (
    <ShopProvider>
      {!isLandingPage && <Navbar />}
      {children}
      {!isLandingPage && <MiniCartDrawer />}
      <ToastStack />
      {!isLandingPage && <TaraChatWidget />}
    </ShopProvider>
  );
}
