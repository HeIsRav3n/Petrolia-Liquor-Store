import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgeGate from "@/components/AgeGate";
import FloatingCart from "@/components/FloatingCart";
import AvailabilityPopup from "@/components/AvailabilityPopup";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Petrolia Liquor Store",
  description:
    "Your local source for premium beer, wine, and spirits in Petrolia. Shop online, call to order, or visit us in-store.",
  keywords: "liquor store, beer, wine, spirits, whisky, vodka, rum, Edmonton, Petrolia",
  openGraph: {
    title: "Petrolia Liquor Store",
    description:
      "Your local source for premium beer, wine, and spirits in Petrolia.",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Petrolia Liquor",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#840404",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Fonts — preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Preload display font to prevent FOUT */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Standalone PWA support */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
      </head>
      <body
        className="min-h-screen flex flex-col transition-colors duration-300"
        suppressHydrationWarning
      >
        <Analytics />
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
