"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  MapPin,
  Phone,
  CreditCard,
  Check,
  Truck,
  Clock,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import Navbar from "@/components/Navbar";

interface CanastaItem {
  id: number;
  producto_id: number;
  nombre: string;
  precio: number;
  imagen: string | null;
  cantidad: number;
  disponible: boolean;
  subtotal: number;
}

export default function CanastaPage() {
  const [items, setItems] = useState<CanastaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [form, setForm] = useState({
    direccion_entrega: "",
    barrio: "",
    referencia: "",
    metodo_pago: "wompi",
    notas: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/cliente/login?redirect=/cliente/canasta");
      return;
    }
    fetchCanasta();
  }, [user, authLoading]);

  const fetchCanasta = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("/api/canasta", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setItems(data.items || []);
    } catch (error) {
      console.error("Error fetching canasta:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCantidad = async (productoId: number, cantidad: number) => {
    if (cantidad <= 0) {
      await removeItem(productoId);
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      await fetch("/api/canasta", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ producto_id: productoId, cantidad }),
      });
      fetchCanasta();
    } catch (error) {
      console.error("Error updating cantidad:", error);
    }
  };

  const removeItem = async (productoId: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      await fetch(`/api/canasta?producto_id=${productoId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCanasta();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleOrden = async () => {
    if (!form.direccion_entrega) {
      setError("La dirección de entrega es requerida");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("accessToken");
      
      const ordenRes = await fetch("/api/ordenes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          direccion_entrega: form.direccion_entrega,
          barrio: form.barrio,
          referencia_direccion: form.referencia,
          metodo_pago: form.metodo_pago,
          notas: form.notas,
        }),
      });

      const ordenData = await ordenRes.json();

      if (!ordenRes.ok) {
        setError(ordenData.error || "Error al crear la orden");
        return;
      }

      if (form.metodo_pago === "contra_entrega") {
        router.push(`/cliente/ordenes?success=true&orden=${ordenData.numero_orden}`);
      } else {
        const pagoRes = await fetch("/api/pagos/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orden_id: ordenData.orden_id }),
        });

        const pagoData = await pagoRes.json();

        if (pagoData.sandbox) {
          router.push(`/cliente/ordenes?success=true&orden=${ordenData.numero_orden}`);
        } else if (pagoData.checkoutUrl) {
          window.location.href = pagoData.checkoutUrl;
        }
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setSubmitting(false);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const costoEnvio = subtotal >= 70000 ? 0 : 5000;
  const total = subtotal + costoEnvio;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
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
        <h1 className="text-3xl font-black text-gray-900 mb-8">Checkout</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Tu canasta está vacía</h2>
            <p className="text-gray-500 mb-6">Agrega productos del menú para hacer tu pedido</p>
            <Link
              href="/cliente/menu"
              className="inline-block px-8 py-3 bg-[#dc2626] text-white rounded-xl font-bold"
            >
              Ver Menú
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress */}
              <div className="flex items-center gap-4">
                {["Canasta", "Dirección", "Pago"].map((label, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        step > i + 1
                          ? "bg-green-500 text-white"
                          : step === i + 1
                          ? "bg-[#dc2626] text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step > i + 1 ? <Check className="w-5 h-5" /> : i + 1}
                    </div>
                    <span className={`text-sm font-medium ${step === i + 1 ? "text-[#dc2626]" : "text-gray-500"}`}>
                      {label}
                    </span>
                    {i < 2 && <div className="w-8 h-0.5 bg-gray-200" />}
                  </div>
                ))}
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                  {error}
                </div>
              )}

              {/* Step 1: Canasta */}
              {step === 1 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Tu Pedido</h2>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          {item.imagen ? (
                            <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <span className="text-3xl">🍕</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{item.nombre}</h4>
                          <p className="text-sm text-gray-500">{formatCurrency(item.precio)} c/u</p>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() => removeItem(item.producto_id)}
                            className="p-2 text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCantidad(item.producto_id, item.cantidad - 1)}
                              className="w-8 h-8 bg-white border rounded-full flex items-center justify-center hover:bg-gray-100"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-bold w-8 text-center">{item.cantidad}</span>
                            <button
                              onClick={() => updateCantidad(item.producto_id, item.cantidad + 1)}
                              className="w-8 h-8 bg-white border rounded-full flex items-center justify-center hover:bg-gray-100"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="w-full mt-6 py-4 bg-[#dc2626] text-white rounded-xl font-bold hover:bg-[#991b1b]"
                  >
                    Continuar
                  </button>
                </div>
              )}

              {/* Step 2: Address */}
              {step === 2 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Dirección de Entrega</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Dirección *
                      </label>
                      <input
                        type="text"
                        value={form.direccion_entrega}
                        onChange={(e) => setForm({ ...form, direccion_entrega: e.target.value })}
                        placeholder="Ej: Cra 15 #45-67, Apto 301"
                        className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-[#dc2626]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Barrio</label>
                        <input
                          type="text"
                          value={form.barrio}
                          onChange={(e) => setForm({ ...form, barrio: e.target.value })}
                          placeholder="Ej: Chapinero"
                          className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-[#dc2626]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Phone className="w-4 h-4 inline mr-1" />
                          Teléfono de contacto
                        </label>
                        <input
                          type="tel"
                          value={user?.telefono || ""}
                          disabled
                          className="w-full px-4 py-3 rounded-xl border bg-gray-50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Referencia (opcional)
                      </label>
                      <input
                        type="text"
                        value={form.referencia}
                        onChange={(e) => setForm({ ...form, referencia: e.target.value })}
                        placeholder="Ej: Frente al parque, Cerca del CC"
                        className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-[#dc2626]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notas adicionales (opcional)
                      </label>
                      <textarea
                        value={form.notas}
                        onChange={(e) => setForm({ ...form, notas: e.target.value })}
                        placeholder="Ej: Sin cebolla, salsa aparte"
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-[#dc2626]"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50"
                    >
                      Volver
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={!form.direccion_entrega}
                      className="flex-1 py-4 bg-[#dc2626] text-white rounded-xl font-bold hover:bg-[#991b1b] disabled:opacity-50"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Método de Pago</h2>
                  <div className="space-y-4">
                    <label className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="metodo_pago"
                        value="wompi"
                        checked={form.metodo_pago === "wompi"}
                        onChange={(e) => setForm({ ...form, metodo_pago: e.target.value })}
                        className="w-5 h-5 text-[#dc2626]"
                      />
                      <CreditCard className="w-6 h-6 text-gray-600" />
                      <div>
                        <p className="font-bold">Tarjeta / PSE / Nequi</p>
                        <p className="text-sm text-gray-500">Pago seguro con Wompi</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="metodo_pago"
                        value="contra_entrega"
                        checked={form.metodo_pago === "contra_entrega"}
                        onChange={(e) => setForm({ ...form, metodo_pago: e.target.value })}
                        className="w-5 h-5 text-[#dc2626]"
                      />
                      <Truck className="w-6 h-6 text-gray-600" />
                      <div>
                        <p className="font-bold">Pago contra entrega</p>
                        <p className="text-sm text-gray-500">Paga cuando recibas tu pedido</p>
                      </div>
                    </label>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 py-4 border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50"
                    >
                      Volver
                    </button>
                    <button
                      onClick={handleOrden}
                      disabled={submitting}
                      className="flex-1 py-4 bg-[#dc2626] text-white rounded-xl font-bold hover:bg-[#991b1b] disabled:opacity-50"
                    >
                      {submitting ? "Procesando..." : "Confirmar Pedido"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen</h3>

                <div className="space-y-3 mb-4 pb-4 border-b">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.nombre} x{item.cantidad}
                      </span>
                      <span className="font-medium">{formatCurrency(item.subtotal)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-4 pb-4 border-b">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Domicilio</span>
                    <span className="font-medium">
                      {costoEnvio === 0 ? (
                        <span className="text-green-600">Gratis</span>
                      ) : (
                        formatCurrency(costoEnvio)
                      )}
                    </span>
                  </div>
                  {costoEnvio > 0 && (
                    <p className="text-xs text-gray-500">
                      Domicilio gratis por compras de {formatCurrency(70000)}
                    </p>
                  )}
                </div>

                <div className="flex justify-between mb-6">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-black text-[#dc2626]">{formatCurrency(total)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Tiempo estimado: 30-45 min</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
