import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Krokori | Nosotros - Nuestra Historia y Equipo",
    template: "%s | Krokori",
  },
  description: "Conoce la historia de Krokori, nuestra misión, valores y el equipo que hace las mejores pizzas de Bogotá. Más de 10 años de experiencia.",
  keywords: ["nosotros pizzeria", "historia krokori", "equipo krokori", "mision pizzeria bogota"],
};

export default function NosotrosLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
