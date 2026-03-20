"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, GripVertical, Pizza } from "lucide-react";

interface Categoria {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  icono: string | null;
  orden: number;
  activo: boolean;
  num_productos: number;
}

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    icono: "",
    orden: "0",
    activo: true,
  });

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("/api/admin/categorias", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCategorias(data.categorias || []);
    } catch (error) {
      console.error("Error fetching categorias:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const method = editingCategoria ? "PUT" : "POST";
      const url = editingCategoria
        ? `/api/admin/categorias/${editingCategoria.id}`
        : "/api/admin/categorias";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          orden: parseInt(form.orden),
        }),
      });

      if (res.ok) {
        fetchCategorias();
        closeModal();
      }
    } catch (error) {
      console.error("Error saving categoria:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta categoría?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`/api/admin/categorias/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchCategorias();
      } else {
        const data = await res.json();
        alert(data.error || "No se puede eliminar");
      }
    } catch (error) {
      console.error("Error deleting categoria:", error);
    }
  };

  const openModal = (categoria?: Categoria) => {
    if (categoria) {
      setEditingCategoria(categoria);
      setForm({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || "",
        icono: categoria.icono || "",
        orden: categoria.orden.toString(),
        activo: categoria.activo,
      });
    } else {
      setEditingCategoria(null);
      setForm({
        nombre: "",
        descripcion: "",
        icono: "",
        orden: categorias.length.toString(),
        activo: true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategoria(null);
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Categorías</h1>
          <p className="text-gray-600 mt-1">{categorias.length} categorías en el menú</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-[#dc2626] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#991b1b] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Categoría
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categorias.map((categoria) => (
          <div
            key={categoria.id}
            className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${
              !categoria.activo ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-[#dc2626]/10 rounded-xl flex items-center justify-center">
                <Pizza className="w-7 h-7 text-[#dc2626]" />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(categoria)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(categoria.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-1">{categoria.nombre}</h3>
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">
              {categoria.descripcion || "Sin descripción"}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                {categoria.num_productos} productos
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  categoria.activo
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {categoria.activo ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingCategoria ? "Editar Categoría" : "Nueva Categoría"}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                <input
                  type="text"
                  required
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  rows={3}
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Orden</label>
                  <input
                    type="number"
                    min="0"
                    value={form.orden}
                    onChange={(e) => setForm({ ...form, orden: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#dc2626]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-8">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.activo}
                      onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-[#dc2626] focus:ring-[#dc2626]"
                    />
                    <span className="text-sm font-medium text-gray-700">Activo</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#dc2626] text-white rounded-xl font-bold hover:bg-[#991b1b] transition-colors"
                >
                  {editingCategoria ? "Guardar Cambios" : "Crear Categoría"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
