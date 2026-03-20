import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Krokori | Menú - Pizza, Hamburguesas y más",
    template: "%s | Krokori",
  },
  description: "Explora nuestro menú de pizzas artesanales, hamburguesas, ensaladas y más. Envíos a domicilio en Bogotá. Los mejores precios y sabores.",
  keywords: ["menú pizza", "pizza bogota", "hamburguesas bogota", "ensaladas", "comida rapida bogota", "domicilio pizza"],
};

export default function MenuLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
