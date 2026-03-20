import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Krokori | Contacto - Contáctanos",
    template: "%s | Krokori",
  },
  description: "Contáctanos para reservas, pedidos o consultas. Teléfono: 300-904-7298. Ubicación en Bogotá. Horario: Lun-Dom.",
  keywords: ["contacto pizzeria", "reservas bogota", "domicilio pizza", "telefono krokori"],
};

export default function ContactoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
