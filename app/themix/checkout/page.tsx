import { ExecutiveEditCheckoutClient } from "./checkout-client";
import type { ExecutivePackageId } from "@/lib/executive-edit/constants";
import "../executive-edit.css";
import "@/app/storefront.css";

export const metadata = {
  title: "Build your Curated Collection | GetPanted",
  description: "Choose Classic or Signature, pick five styles and sizes, and complete full payment.",
};

export default async function ExecutiveEditCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string }>;
}) {
  const params = await searchParams;
  const raw = params.package;
  const initialPackage: ExecutivePackageId =
    raw === "signature" || raw === "classic" ? raw : "classic";

  return (
    <main className="ee-page font-barlow overflow-x-hidden min-h-screen">
      <ExecutiveEditCheckoutClient initialPackage={initialPackage} />
    </main>
  );
}
