import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Distance Remaining — JHU Sustainability Target Tracker",
  description: "A 2024 public-data snapshot of Johns Hopkins sustainability progress and commitments.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
