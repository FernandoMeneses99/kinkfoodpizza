"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  Phone,
  MapPin,
  Clock,
  ChevronRight,
  Check,
  X,
  Eye,
  Bell,
  Volume2,
} from "lucide-react";

interface OrdenDetalle {
  id: number;
  producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

interface Orden {
  id: number;
  numero_orden: string;
  estado: string;
  estado_pago: string;
  cliente: string;
  telefono: string;
  email: string;
  direccion: string;
  barrio: string;
  subtotal: number;
  costo_domicilio: number;
  descuento: number;
  total: number;
  metodo_pago: string;
  repartidor: string;
  created_at: string;
  items: OrdenDetalle[];
}

const estadosOrden = [
  { id: "pendiente", label: "Pendiente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  { id: "pagado", label: "Pagado", color: "bg-blue-100 text-blue-800", icon: Check },
  { id: "confirmado", label: "Confirmado", color: "bg-green-100 text-green-800", icon: Check },
  { id: "preparando", label: "Preparando", color: "bg-orange-100 text-orange-800", icon: Clock },
  { id: "listo", label: "Listo", color: "bg-purple-100 text-purple-800", icon: Check },
  { id: "en_camino", label: "En Camino", color: "bg-indigo-100 text-indigo-800", icon: MapPin },
  { id: "entregado", label: "Entregado", color: "bg-green-100 text-green-800", icon: Check },
  { id: "cancelado", label: "Cancelado", color: "bg-red-100 text-red-800", icon: X },
];

export default function AdminOrdenes() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterEstado, setFilterEstado] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrden, setSelectedOrden] = useState<Orden | null>(null);
  const [updating, setUpdating] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastOrderIdRef = useRef<number | null>(null);
  const previousOrderIdsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    audioRef.current = new Audio("/sounds/notification.mp3");
    audioRef.current.volume = 0.5;
  }, []);

  useEffect(() => {
    fetchOrdenes();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrdenesSilent();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const playNotificationSound = () => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = "sine";
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 200);
    } catch {
      console.log("Audio not supported");
    }
  };

  const fetchOrdenes = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("/api/admin/ordenes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const ordenesData = data.ordenes || [];
      
      if (lastOrderIdRef.current === null) {
        lastOrderIdRef.current = ordenesData[0]?.id || null;
        previousOrderIdsRef.current = new Set(ordenesData.map((o: Orden) => o.id));
      }
      
      setOrdenes(ordenesData);
    } catch (error) {
      console.error("Error fetching ordenes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrdenesSilent = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("/api/admin/ordenes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const ordenesData: Orden[] = data.ordenes || [];
      
      const newOrdenes = ordenesData.filter(
        (o) => !previousOrderIdsRef.current.has(o.id)
      );
      
      if (newOrdenes.length > 0) {
        setNewOrdersCount((prev) => prev + newOrdenes.length);
        setShowNotification(true);
        playNotificationSound();
        
        setTimeout(() => {
          setShowNotification(false);
        }, 5000);
      }
      
      previousOrderIdsRef.current = new Set(ordenesData.map((o: Orden) => o.id));
      setOrdenes(ordenesData);
    } catch (error) {
      console.error("Error fetching ordenes:", error);
    }
  };

  const updateEstado = async (id: number, nuevoEstado: string) => {
    if (updating) return;
    setUpdating(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("/api/admin/ordenes", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, estado: nuevoEstado }),
      });

      if (res.ok) {
        fetchOrdenes();
        if (selectedOrden?.id === id) {
          setSelectedOrden({ ...selectedOrden, estado: nuevoEstado });
        }
      }
    } catch (error) {
      console.error("Error updating orden:", error);
    } finally {
      setUpdating(false);
    }
  };

  const getNextEstados = (currentEstado: string) => {
    const flow: Record<string, string[]> = {
      pendiente: ["confirmado", "pagado", "cancelado"],
      pagado: ["confirmado", "cancelado"],
      confirmado: ["preparando", "cancelado"],
      preparando: ["listo", "cancelado"],
      listo: ["en_camino", "cancelado"],
      en_camino: ["entregado", "cancelado"],
      entregado: [],
      cancelado: [],
    };
    return flow[currentEstado] || [];
  };

  const filteredOrdenes = ordenes.filter((o) => {
    const matchEstado = !filterEstado || o.estado === filterEstado;
    const matchSearch =
      !searchTerm ||
      o.numero_orden.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.telefono?.includes(searchTerm);
    return matchEstado && matchSearch;
  });

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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusInfo = (estado: string) => {
    return estadosOrden.find((e) => e.id === estado) || estadosOrden[0];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#dc2626] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Notification Banner */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
            <div className="relative">
              <Bell className="w-6 h-6 animate-bounce" />
              {newOrdersCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 text-green-800 text-xs font-bold rounded-full flex items-center justify-center">
                  {newOrdersCount}
                </span>
              )}
            </div>
            <div>
              <p className="font-bold">¡Nueva orden!</p>
              <p className="text-sm text-green-100">Hay {newOrdersCount > 0 ? `${newOrdersCount} nuevo(s)` : '1 nuevo'} pedido(s)</p>
            </div>
            <button
              onClick={() => {
                setShowNotification(false);
                setNewOrdersCount(0);
              }}
              className="ml-2 p-1 hover:bg-green-700 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Órdenes</h1>
          <p className="text-gray-600 mt-1">
            {ordenes.length} órdenes | {ordenes.filter((o) => !["entregado", "cancelado"].includes(o.estado)).length} activas
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Sound toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-3 rounded-xl transition-colors ${
              soundEnabled 
                ? "bg-green-100 text-green-700 hover:bg-green-200" 
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
            title={soundEnabled ? "Sonido activado" : "Sonido desactivado"}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
          {/* Refresh button */}
          <button
            onClick={() => {
              fetchOrdenes();
              setNewOrdersCount(0);
            }}
            className="px-4 py-2 bg-[#dc2626] text-white rounded-xl font-medium hover:bg-[#991b1b] transition-colors"
          >
            Actualizar
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por número, cliente o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#dc2626]"
          />
        </div>
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#dc2626] min-w-[200px]"
        >
          <option value="">Todos los estados</option>
          {estadosOrden.map((e) => (
            <option key={e.id} value={e.id}>
              {e.label}
            </option>
          ))}
        </select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrdenes.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <p className="text-gray-500">No hay órdenes que mostrar</p>
          </div>
        ) : (
          filteredOrdenes.map((orden) => {
            const statusInfo = getStatusInfo(orden.estado);
            const StatusIcon = statusInfo.icon;
            const nextEstados = getNextEstados(orden.estado);

            return (
              <div
                key={orden.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{orden.numero_orden}</h3>
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusInfo.label}
                      </span>
                      {orden.estado_pago === "pagado" && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Pagado
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span className="font-medium">{orden.cliente || "Cliente"}</span>
                      {orden.telefono && (
                        <a href={`tel:${orden.telefono}`} className="flex items-center gap-1 hover:text-[#dc2626]">
                          <Phone className="w-4 h-4" />
                          {orden.telefono}
                        </a>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(orden.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-black text-[#dc2626]">{formatCurrency(orden.total)}</p>
                      <p className="text-sm text-gray-500">
                        {orden.items.length} producto{orden.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedOrden(orden)}
                      className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      <Eye className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Next actions */}
                {nextEstados.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                    {nextEstados.map((nextEstado) => {
                      const nextInfo = getStatusInfo(nextEstado);
                      return (
                        <button
                          key={nextEstado}
                          onClick={() => updateEstado(orden.id, nextEstado)}
                          disabled={updating}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all hover:scale-105 ${
                            nextEstado === "cancelado"
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          <ChevronRight className="w-4 h-4" />
                          {nextEstado === "cancelado" ? "Cancelar" : `Marcar como ${nextInfo.label}`}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrden && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedOrden.numero_orden}</h2>
                <p className="text-sm text-gray-500">{formatDate(selectedOrden.created_at)}</p>
              </div>
              <button
                onClick={() => setSelectedOrden(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Client Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-3">Información del Cliente</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Nombre</p>
                    <p className="font-medium">{selectedOrden.cliente || "No disponible"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Teléfono</p>
                    <a href={`tel:${selectedOrden.telefono}`} className="font-medium text-[#dc2626]">
                      {selectedOrden.telefono || "No disponible"}
                    </a>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Dirección</p>
                    <p className="font-medium">
                      {selectedOrden.direccion}
                      {selectedOrden.barrio && ` - ${selectedOrden.barrio}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Productos</h3>
                <div className="space-y-3">
                  {selectedOrden.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-medium text-gray-900">{item.producto}</p>
                        <p className="text-sm text-gray-500">
                          {item.cantidad} x {formatCurrency(item.precio_unitario)}
                        </p>
                      </div>
                      <p className="font-bold text-gray-900">{formatCurrency(item.subtotal)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(selectedOrden.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Domicilio</span>
                  <span className="font-medium">
                    {selectedOrden.costo_domicilio > 0
                      ? formatCurrency(selectedOrden.costo_domicilio)
                      : "Gratis"}
                  </span>
                </div>
                {selectedOrden.descuento > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Descuento</span>
                    <span className="font-medium">-{formatCurrency(selectedOrden.descuento)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-[#dc2626]">{formatCurrency(selectedOrden.total)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2">
                  <span className="text-gray-600">Método de pago</span>
                  <span className="font-medium">{selectedOrden.metodo_pago.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
