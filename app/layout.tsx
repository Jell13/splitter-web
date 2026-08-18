import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./provider/ConvexClientProvider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Split-it",
  description: "Split bills with friends, without the headache.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <ConvexClientProvider>
          {children}
          <Toaster position="top-center" />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
