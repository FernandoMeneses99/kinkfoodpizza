"use client";

import { useState, useEffect } from "react";
import {
  ShoppingCart,
  DollarSign,
  Users,
  TrendingUp,
  Pizza,
  Clock,
  ArrowUpRight,
  Printer,
  Receipt,
  Package,
  MessageCircle,
  Mail,
  X,
} from "lucide-react";
import Link from "next/link";

interface Stats {
  ordenes_hoy: number;
  ventas_hoy: number;
  ordenes_activas: number;
  productos_disponibles: number;
  nuevos_clientes_hoy: number;
  ordenes_pendientes_pago: number;
  total_clientes: number;
  total_ordenes: number;
}

interface RecentOrder {
  id_orden: number;
  numero_orden: string;
  estado: string;
  total: number;
  created_at: string;
  cliente: string;
}

interface ProductoTop {
  nombre: string;
  cantidad_vendida: number;
  total_vendido: number;
}

interface Contacto {
  id: number;
  nombre: string;
  email: string;
  servicio: string;
  mensaje: string;
  leido: number;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [ordenesRecientes, setOrdenesRecientes] = useState<RecentOrder[]>([]);
  const [productosTop, setProductosTop] = useState<ProductoTop[]>([]);
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [contactosSinLeer, setContactosSinLeer] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFactura, setShowFactura] = useState(false);
  const [facturaData, setFacturaData] = useState<{ factura: string; orden: RecentOrder; items: any[]; totales: any } | null>(null);
  const [selectedContacto, setSelectedContacto] = useState<Contacto | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboard();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStats(data.stats);
      setOrdenesRecientes(data.ordenes_recientes || []);
      setProductosTop(data.productos_mas_vendidos || []);

      const contactosRes = await fetch("/api/admin/contactos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const contactosData = await contactosRes.json();
      setContactos(contactosData.contactos || []);
      setContactosSinLeer(contactosData.noLeidos || 0);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      await fetch("/api/admin/contactos", {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ id, leido: true })
      });
      fetchDashboard();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pendiente: "bg-yellow-100 text-yellow-800",
      pagado: "bg-blue-100 text-blue-800",
      confirmado: "bg-green-100 text-green-800",
      preparando: "bg-orange-100 text-orange-800",
      listo: "bg-purple-100 text-purple-800",
      en_camino: "bg-indigo-100 text-indigo-800",
      entregado: "bg-green-100 text-green-800",
      cancelado: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pendiente: "Pendiente",
      pagado: "Pagado",
      confirmado: "Confirmado",
      preparando: "Preparando",
      listo: "Listo",
      en_camino: "En Camino",
      entregado: "Entregado",
      cancelado: "Cancelado",
    };
    return labels[status] || status;
  };

  const imprimirFactura = async (ordenId: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`/api/admin/factura?id=${ordenId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setFacturaData(data);
        setShowFactura(true);
      }
    } catch (error) {
      console.error("Error fetching factura:", error);
    }
  };

  const printFactura = () => {
    if (!facturaData) return;
    
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Factura ${facturaData.orden.numero_orden}</title>
            <style>
              body {
                font-family: 'Courier New', monospace;
                font-size: 12px;
                max-width: 300px;
                margin: 0 auto;
                padding: 10px;
                white-space: pre-wrap;
              }
              @media print {
                body { margin: 0; padding: 5px; }
              }
            </style>
          </head>
          <body>${facturaData.factura}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
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
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Resumen de tu restaurante</p>
          </div>
          <button
            onClick={fetchDashboard}
            className="px-4 py-2 bg-[#dc2626] text-white rounded-xl font-medium hover:bg-[#991b1b] transition-colors flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Actualizar
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-[#dc2626]/10 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-[#dc2626]" />
            </div>
            <span className="text-xs text-green-600 font-medium">HOY</span>
          </div>
          <h3 className="text-2xl font-black text-gray-900">{stats?.ordenes_hoy || 0}</h3>
          <p className="text-gray-500 text-xs">Órdenes</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs text-green-600 font-medium">HOY</span>
          </div>
          <h3 className="text-2xl font-black text-gray-900">{formatCurrency(stats?.ventas_hoy || 0)}</h3>
          <p className="text-gray-500 text-xs">Ventas</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-xs text-orange-600 font-medium">ACT</span>
          </div>
          <h3 className="text-2xl font-black text-gray-900">{stats?.ordenes_activas || 0}</h3>
          <p className="text-gray-500 text-xs">Activas</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs text-blue-600 font-medium">TOTAL</span>
          </div>
          <h3 className="text-2xl font-black text-gray-900">{stats?.total_clientes || 0}</h3>
          <p className="text-gray-500 text-xs">Clientes</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Receipt className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs text-purple-600 font-medium">TOTAL</span>
          </div>
          <h3 className="text-2xl font-black text-gray-900">{stats?.total_ordenes || 0}</h3>
          <p className="text-gray-500 text-xs">Órdenes Totales</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            {contactosSinLeer > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                {contactosSinLeer}
              </span>
            )}
          </div>
          <h3 className="text-2xl font-black text-gray-900">{contactosSinLeer}</h3>
          <p className="text-gray-500 text-xs">Mensajes Nuevos</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Órdenes Recientes</h2>
            <Link
              href="/admin/ordenes"
              className="text-[#dc2626] text-sm font-medium hover:underline"
            >
              Ver todas →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {ordenesRecientes.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No hay órdenes recientes</p>
              </div>
            ) : (
              ordenesRecientes.map((orden) => (
                <div key={orden.id_orden} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-gray-900">{orden.numero_orden}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(orden.estado)}`}>
                        {getStatusLabel(orden.estado)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{orden.cliente || "Cliente"}</p>
                    <p className="text-xs text-gray-400">{formatDate(orden.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-[#dc2626]">{formatCurrency(orden.total)}</p>
                    <button
                      onClick={() => imprimirFactura(orden.id_orden)}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Imprimir Factura"
                    >
                      <Printer className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Products */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#dc2626]" />
                Productos Más Vendidos
              </h2>
            </div>
            <div className="p-4">
              {productosTop.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">Sin datos</p>
              ) : (
                <div className="space-y-3">
                  {productosTop.map((producto, index) => (
                    <div key={producto.nombre} className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-400 text-yellow-900' :
                        index === 1 ? 'bg-gray-300 text-gray-700' :
                        index === 2 ? 'bg-orange-300 text-orange-900' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate text-sm">{producto.nombre}</p>
                        <p className="text-xs text-gray-500">{producto.cantidad_vendida} vendidos</p>
                      </div>
                      <p className="font-bold text-gray-900 text-sm">{formatCurrency(producto.total_vendido)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Acciones Rápidas</h2>
            </div>
            <div className="p-4 space-y-3">
              <Link
                href="/admin/productos"
                className="flex items-center gap-3 p-3 bg-[#dc2626]/5 rounded-xl hover:bg-[#dc2626]/10 transition-colors"
              >
                <div className="w-10 h-10 bg-[#dc2626] rounded-lg flex items-center justify-center">
                  <Pizza className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Agregar Producto</p>
                  <p className="text-xs text-gray-500">Nuevo plato al menú</p>
                </div>
              </Link>

              <Link
                href="/admin/ordenes"
                className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
              >
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">Ver Órdenes</p>
                  <p className="text-xs text-gray-500">{stats?.ordenes_pendientes_pago || 0} pendientes</p>
                </div>
                {stats?.ordenes_pendientes_pago && stats.ordenes_pendientes_pago > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                    {stats.ordenes_pendientes_pago}
                  </span>
                )}
              </Link>

              <Link
                href="/admin/categorias"
                className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
              >
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Categorías</p>
                  <p className="text-xs text-gray-500">Gestionar menú</p>
                </div>
              </Link>

              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Ver Sitio</p>
                  <p className="text-xs text-gray-500">Abrir página pública</p>
                </div>
              </Link>

              <button
                onClick={() => {
                  const firstUnread = contactos.find(c => !c.leido);
                  if (firstUnread) setSelectedContacto(firstUnread);
                }}
                className="w-full flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
              >
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-gray-900">Mensajes</p>
                  <p className="text-xs text-gray-500">{contactosSinLeer} sin leer</p>
                </div>
              </button>
            </div>
          </div>

          {/* Mensajes Recientes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#dc2626]" />
                Mensajes Recientes
              </h2>
            </div>
            <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
              {contactos.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No hay mensajes</p>
                </div>
              ) : (
                contactos.slice(0, 5).map((contacto) => (
                  <button
                    key={contacto.id}
                    onClick={() => {
                      setSelectedContacto(contacto);
                      if (!contacto.leido) markAsRead(contacto.id);
                    }}
                    className={`w-full p-4 hover:bg-gray-50 transition-colors text-left ${!contacto.leido ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        !contacto.leido ? 'bg-[#dc2626]' : 'bg-gray-400'
                      }`}>
                        {contacto.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900 truncate">{contacto.nombre}</p>
                          {!contacto.leido && (
                            <span className="w-2 h-2 bg-[#dc2626] rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">{contacto.email}</p>
                        <p className="text-xs text-gray-400 truncate mt-1">{contacto.mensaje}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(contacto.created_at)}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contacto Modal */}
      {selectedContacto && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#dc2626] to-[#991b1b] text-white">
              <div>
                <h3 className="font-bold">Mensaje de {selectedContacto.nombre}</h3>
                <p className="text-sm text-white/80">{selectedContacto.email}</p>
              </div>
              <button
                onClick={() => setSelectedContacto(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {selectedContacto.servicio && (
                <div className="mb-4">
                  <span className="text-xs font-bold text-gray-500 uppercase">Servicio:</span>
                  <p className="text-gray-900">{selectedContacto.servicio}</p>
                </div>
              )}
              <div className="mb-4">
                <span className="text-xs font-bold text-gray-500 uppercase">Mensaje:</span>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedContacto.mensaje}</p>
              </div>
              <div className="text-xs text-gray-400">
                Enviado: {formatDate(selectedContacto.created_at)}
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex gap-3">
              <a
                href={`mailto:${selectedContacto.email}?subject=Re: Krokori - Contacto`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Responder por Email
              </a>
              <a
                href={`https://wa.me/?text=Hola ${selectedContacto.nombre}, gracias por contactarnos`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Factura Modal */}
      {showFactura && facturaData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div>
                <h3 className="font-bold text-gray-900">Factura #{facturaData.orden.numero_orden}</h3>
                <p className="text-sm text-gray-500">{facturaData.orden.cliente}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={printFactura}
                  className="px-4 py-2 bg-[#dc2626] text-white rounded-lg font-medium hover:bg-[#991b1b] transition-colors flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir
                </button>
                <button
                  onClick={() => setShowFactura(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <pre className="font-mono text-xs whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border">
                {facturaData.factura}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
