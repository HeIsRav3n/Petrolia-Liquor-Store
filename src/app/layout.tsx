import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgeGate from "@/components/AgeGate";
import FloatingCart from "@/components/FloatingCart";
import AvailabilityPopup from "@/components/AvailabilityPopup";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "Petrolia Liquor Store",
  description: "Your local source for premium beer, wine, and spirits in Petrolia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col transition-colors duration-300">
        {/* Placeholder for Analytics/Monitoring (e.g., @vercel/analytics) */}
        {/* <Analytics /> */}
        <ThemeProvider>
          <AgeGate />
          <CartProvider>
            <Navbar />
            <AvailabilityPopup />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingCart />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
