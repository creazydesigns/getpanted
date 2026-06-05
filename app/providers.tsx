"use client";

import { usePathname } from "next/navigation";
import { ShopProvider } from "./context/shop-context";
import { MiniCartDrawer, ToastStack } from "./components/shop-ui";
import { Navbar } from "./components/navbar";
import { TaraChatWidget } from "./components/tara-chat";

const LANDING_ROUTES = ["/waitlist"];
const HIDE_STOREFRONT_ROUTES = ["/admin"];

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = LANDING_ROUTES.some((route) => pathname?.startsWith(route));
  const isAdmin = HIDE_STOREFRONT_ROUTES.some((route) => pathname?.startsWith(route));
  const showStore = !isLandingPage && !isAdmin;

  return (
    <ShopProvider>
      {showStore && <Navbar />}
      {children}
      {showStore && <MiniCartDrawer />}
      <ToastStack />
      {showStore && <TaraChatWidget />}
    </ShopProvider>
  );
}
