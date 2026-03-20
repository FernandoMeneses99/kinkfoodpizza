"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Package,
  Clock,
  MapPin,
  Check,
  ChefHat,
  Bike,
  Home,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import Navbar from "@/components/Navbar";

interface Orden {
  id: number;
  numero_orden: string;
  estado: string;
  estado_pago: string;
  direccion: string;
  subtotal: number;
  costo_domicilio: number;
  total: number;
  metodo_pago: string;
  created_at: string;
  items: { producto: string; cantidad: number; precio: number }[];
}

const estadoInfo: Record<string, { label: string; color: string; icon: any }> = {
  pendiente: { label: "Pendiente de Pago", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  pagado: { label: "Pagado", color: "bg-blue-100 text-blue-800", icon: Check },
  confirmado: { label: "Confirmado", color: "bg-green-100 text-green-800", icon: Check },
  preparando: { label: "Preparando", color: "bg-orange-100 text-orange-800", icon: ChefHat },
  listo: { label: "Listo para Entregar", color: "bg-purple-100 text-purple-800", icon: Package },
  en_camino: { label: "En Camino", color: "bg-indigo-100 text-indigo-800", icon: Bike },
  entregado: { label: "Entregado", color: "bg-green-100 text-green-800", icon: Home },
  cancelado: { label: "Cancelado", color: "bg-red-100 text-red-800", icon: Clock },
};

function OrdenesContent() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = "/cliente/login?redirect=/cliente/ordenes";
      return;
    }

    if (searchParams.get("success")) {
      setSuccessMessage(`¡Orden ${searchParams.get("orden")} creada exitosamente!`);
    }

    fetchOrdenes();
  }, [user, authLoading, searchParams]);

  const fetchOrdenes = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("/api/ordenes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrdenes(data.ordenes || []);
    } catch (error) {
      console.error("Error fetching ordenes:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#dc2626] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Mis Órdenes</h1>

        {successMessage && (
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-green-800">{successMessage}</h3>
                <p className="text-sm text-green-600">
                  Te notificaremos cuando haya actualizaciones de tu pedido
                </p>
              </div>
            </div>
          </div>
        )}

        {ordenes.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No tienes órdenes aún</h2>
            <p className="text-gray-500 mb-6">Haz tu primer pedido desde nuestro menú</p>
            <Link
              href="/cliente/menu"
              className="inline-block px-8 py-3 bg-[#dc2626] text-white rounded-xl font-bold"
            >
              Ver Menú
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {ordenes.map((orden) => {
              const info = estadoInfo[orden.estado] || estadoInfo.pendiente;
              const StatusIcon = info.icon;

              return (
                <div key={orden.id} className="bg-white rounded-2xl p-6 shadow-sm">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{orden.numero_orden}</h3>
                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${info.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          {info.label}
                        </span>
                        {orden.estado_pago === "pagado" && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Pagado
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{formatDate(orden.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-[#dc2626]">{formatCurrency(orden.total)}</p>
                      <p className="text-sm text-gray-500">
                        {orden.items.length} producto{orden.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded-xl">
                    <MapPin className="w-4 h-4" />
                    <span>{orden.direccion}</span>
                  </div>

                  {/* Items */}
                  <div className="border-t pt-4">
                    <h4 className="font-bold text-gray-700 mb-3">Productos</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {orden.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.cantidad}x {item.producto}
                          </span>
                          <span className="font-medium">{formatCurrency(item.precio * item.cantidad)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline visualization */}
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      {["pendiente", "confirmado", "preparando", "en_camino", "entregado"].map((step, i) => {
                        const stepIndex = ["pendiente", "pagado", "confirmado", "preparando", "listo", "en_camino", "entregado"].indexOf(orden.estado);
                        const currentIndex = ["pendiente", "pagado", "confirmado", "preparando", "listo", "en_camino", "entregado"].indexOf(step);
                        const isCompleted = currentIndex <= stepIndex;
                        const isActive = step === orden.estado;

                        return (
                          <div key={step} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isCompleted ? "bg-[#dc2626] text-white" : "bg-gray-200 text-gray-400"
                            } ${isActive ? "ring-4 ring-[#dc2626]/30" : ""}`}>
                              {i + 1}
                            </div>
                            {i < 4 && (
                              <div className={`w-8 sm:w-16 h-1 ${
                                isCompleted && currentIndex < stepIndex ? "bg-[#dc2626]" : "bg-gray-200"
                              }`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>Orden</span>
                      <span>Prep.</span>
                      <span>Camino</span>
                      <span>Entrega</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function OrdenesLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#dc2626] border-t-transparent"></div>
    </div>
  );
}

export default function OrdenesPage() {
  return (
    <Suspense fallback={<OrdenesLoading />}>
      <OrdenesContent />
    </Suspense>
  );
}
