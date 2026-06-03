import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "10% Off Your First Order — GetPanted Waitlist",
  description:
    "Join the GetPanted waitlist today and secure 10% off your first order.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function WaitlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
