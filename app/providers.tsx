"use client";

import { ShopProvider } from "./context/shop-context";
import { MiniCartDrawer, ToastStack } from "./components/shop-ui";
import { Navbar } from "./components/navbar";
import { TaraChatWidget } from "./components/tara-chat";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ShopProvider>
      <Navbar />
      {children}
      <MiniCartDrawer />
      <ToastStack />
      <TaraChatWidget />
    </ShopProvider>
  );
}
