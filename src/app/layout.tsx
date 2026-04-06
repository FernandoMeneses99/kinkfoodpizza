import type { Metadata } from "next";
import { Roboto, Raleway, Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { CookieProvider } from "@/components/providers/CookieProvider";
import CookieBanner from "@/components/CookieBanner";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Krokori | Pizzeria Artesanal en Bogotá",
    template: "%s | Krokori",
  },
  description: "Krokori - La mejor pizzeria artesanal en Bogotá. Pizza con masa madurada 72hrs, ingredientes frescos de Boyacá, horno de leña. Domicilio gratis por compras +$70.000. ¡Ordena ya!",
  keywords: ["pizzeria", "pizza bogota", "pizza artesanal", "domicilio pizza", "krokori", "mejor pizza bogota", "hamburguesas", "comida rapida"],
  authors: [{ name: "Krokori" }],
  creator: "Krokori",
  publisher: "Krokori",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://krokori.com"),
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://krokori.com",
    siteName: "Krokori",
    title: "Krokori | Pizzeria Artesanal en Bogotá",
    description: "La mejor pizzeria artesanal en Bogotá. Pizza con masa madurada 72hrs, ingredientes frescos, horno de leña.",
    images: [
      {
        url: "/images/logo-198x662.png",
        width: 198,
        height: 66,
        alt: "Krokori - Pizzeria Artesanal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Krokori | Pizzeria Artesanal en Bogotá",
    description: "La mejor pizzeria artesanal en Bogotá. ¡Ordena ya!",
    images: ["/images/logo-198x662.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="wide wow-animation">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${roboto.variable} ${raleway.variable} ${poppins.variable}`} suppressHydrationWarning>
        <CookieProvider>
          <AuthProvider>
            {children}
            <CookieBanner />
          </AuthProvider>
        </CookieProvider>
      </body>
    </html>
  );
}