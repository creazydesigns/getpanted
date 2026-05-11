"use client";

import { ShopProvider } from "./context/shop-context";
import { ThemeProvider } from "./context/theme-context";
import { MiniCartDrawer, ToastStack } from "./components/shop-ui";
import { Navbar } from "./components/navbar";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ShopProvider>
        <Navbar />
        {children}
        <MiniCartDrawer />
        <ToastStack />
      </ShopProvider>
    </ThemeProvider>
  );
}
