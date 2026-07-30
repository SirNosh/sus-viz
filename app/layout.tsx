import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://jhu-distance-remaining.sirnosh.chatgpt.site"),
  title: "The Distance Remaining — JHU Sustainability Target Tracker",
  description: "A 2024 public-data snapshot of Johns Hopkins sustainability progress and commitments.",
  openGraph: {
    title: "The Distance Remaining",
    description: "2024 JHU Sustainability Target Tracker",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "The Distance Remaining — 2024 JHU Sustainability Target Tracker" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Distance Remaining",
    description: "2024 JHU Sustainability Target Tracker",
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
