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
  ArrowDownRight,
} from "lucide-react";
import Link from "next/link";

interface Stats {
  ordenes_hoy: number;
  ventas_hoy: number;
  ordenes_activas: number;
  productos_disponibles: number;
  nuevos_clientes_hoy: number;
  ordenes_pendientes_pago: number;
}

interface RecentOrder {
  id_orden: number;
  numero_orden: string;
  estado: string;
  total: number;
  created_at: string;
  cliente: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [ordenesRecientes, setOrdenesRecientes] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
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
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-black text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Resumen de tu restaurante</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#dc2626]/10 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-[#dc2626]" />
            </div>
            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <ArrowUpRight className="w-4 h-4" />
              Hoy
            </span>
          </div>
          <h3 className="text-3xl font-black text-gray-900">{stats?.ordenes_hoy || 0}</h3>
          <p className="text-gray-600 text-sm">Órdenes hoy</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <ArrowUpRight className="w-4 h-4" />
              Hoy
            </span>
          </div>
          <h3 className="text-3xl font-black text-gray-900">{formatCurrency(stats?.ventas_hoy || 0)}</h3>
          <p className="text-gray-600 text-sm">Ventas hoy</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-orange-600 text-sm font-medium">Activas</span>
          </div>
          <h3 className="text-3xl font-black text-gray-900">{stats?.ordenes_activas || 0}</h3>
          <p className="text-gray-600 text-sm">Órdenes activas</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <ArrowUpRight className="w-4 h-4" />
              Nuevos
            </span>
          </div>
          <h3 className="text-3xl font-black text-gray-900">{stats?.nuevos_clientes_hoy || 0}</h3>
          <p className="text-gray-600 text-sm">Clientes nuevos</p>
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
              Ver todas
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
                <div key={orden.id_orden} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">{orden.numero_orden}</p>
                      <p className="text-sm text-gray-500">{orden.cliente || "Cliente"}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(orden.estado)}`}>
                        {orden.estado.replace("_", " ")}
                      </span>
                      <p className="text-sm font-bold text-gray-900 mt-1">{formatCurrency(orden.total)}</p>
                      <p className="text-xs text-gray-500">{formatDate(orden.created_at)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Acciones Rápidas</h2>
          </div>
          <div className="p-6 space-y-4">
            <Link
              href="/admin/productos"
              className="flex items-center gap-4 p-4 bg-[#dc2626]/5 rounded-xl hover:bg-[#dc2626]/10 transition-colors"
            >
              <div className="w-10 h-10 bg-[#dc2626] rounded-xl flex items-center justify-center">
                <Pizza className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Agregar Producto</p>
                <p className="text-sm text-gray-500">Nuevo plato al menú</p>
              </div>
            </Link>

            <Link
              href="/admin/ordenes"
              className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
            >
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Ver Órdenes</p>
                <p className="text-sm text-gray-500">{stats?.ordenes_pendientes_pago || 0} pendientes</p>
              </div>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Ver Sitio</p>
                <p className="text-sm text-gray-500">Abrir página pública</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
