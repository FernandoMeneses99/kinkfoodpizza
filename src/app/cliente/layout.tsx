"use client";

import { AuthProvider } from "@/components/providers/AuthProvider";

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
