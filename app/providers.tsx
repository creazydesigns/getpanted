"use client";

import { ShopProvider } from "./context/shop-context";
import { ThemeProvider } from "./context/theme-context";
import { MiniCartDrawer, ToastStack } from "./components/shop-ui";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ShopProvider>
        {children}
        <MiniCartDrawer />
        <ToastStack />
      </ShopProvider>
    </ThemeProvider>
  );
}
