"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Image as ImageIcon,
  ToggleLeft,
  ToggleRight,
  Star,
  X,
  Upload,
} from "lucide-react";

interface Producto {
  id: number;
  categoria_id: number;
  categoria_nombre: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  precio: number;
  precio_oferta: number | null;
  imagen: string | null;
  ingredientes: string | null;
  disponible: boolean;
  destacado: boolean;
  tiempo_preparacion: number;
  stock: number;
  activo: boolean;
}

interface Categoria {
  id: number;
  nombre: string;
}

export default function AdminProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    categoria_id: "",
    descripcion: "",
    precio: "",
    precio_oferta: "",
    ingredientes: "",
    tiempo_preparacion: "15",
    disponible: true,
    destacado: false,
    stock: "100",
    imagen: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/admin/productos", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/categorias", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const prodData = await prodRes.json();
      const catData = await catRes.json();

      setProductos(prodData.productos || []);
      setCategorias(catData.categorias || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const method = editingProduct ? "PUT" : "POST";
      const url = editingProduct
        ? `/api/admin/productos/${editingProduct.id}`
        : "/api/admin/productos";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          precio: parseFloat(form.precio),
          precio_oferta: form.precio_oferta ? parseFloat(form.precio_oferta) : null,
          categoria_id: parseInt(form.categoria_id),
          tiempo_preparacion: parseInt(form.tiempo_preparacion),
          stock: parseInt(form.stock),
        }),
      });

      if (res.ok) {
        fetchData();
        closeModal();
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`/api/admin/productos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleToggleDisponible = async (product: Producto) => {
    try {
      const token = localStorage.getItem("accessToken");
      await fetch(`/api/admin/productos/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: product.nombre,
          categoria_id: product.categoria_id,
          precio: product.precio,
          disponible: !product.disponible,
          destacado: product.destacado,
        }),
      });
      fetchData();
    } catch (error) {
      console.error("Error toggling disponible:", error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setForm({ ...form, imagen: data.url });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const openModal = (product?: Producto) => {
    if (product) {
      setEditingProduct(product);
      setForm({
        nombre: product.nombre,
        categoria_id: product.categoria_id.toString(),
        descripcion: product.descripcion || "",
        precio: product.precio.toString(),
        precio_oferta: product.precio_oferta?.toString() || "",
        ingredientes: product.ingredientes || "",
        tiempo_preparacion: product.tiempo_preparacion.toString(),
        disponible: product.disponible,
        destacado: product.destacado,
        stock: product.stock.toString(),
        imagen: product.imagen || "",
      });
    } else {
      setEditingProduct(null);
      setForm({
        nombre: "",
        categoria_id: "",
        descripcion: "",
        precio: "",
        precio_oferta: "",
        ingredientes: "",
        tiempo_preparacion: "15",
        disponible: true,
        destacado: false,
        stock: "100",
        imagen: "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const filteredProductos = productos.filter((p) =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
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
          <h1 className="text-3xl font-black text-gray-900">Productos</h1>
          <p className="text-gray-600 mt-1">{productos.length} productos en el menú</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-[#dc2626] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#991b1b] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#dc2626]"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Producto</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Categoría</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Precio</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProductos.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {product.imagen ? (
                          <img src={product.imagen} alt={product.nombre} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{product.nombre}</p>
                        {product.destacado && (
                          <span className="inline-flex items-center gap-1 text-xs text-yellow-600">
                            <Star className="w-3 h-3 fill-current" />
                            Destacado
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{product.categoria_nombre}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{formatCurrency(product.precio)}</p>
                    {product.precio_oferta && (
                      <p className="text-xs text-green-600">{formatCurrency(product.precio_oferta)}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={product.stock < 10 ? "text-red-600 font-bold" : "text-gray-600"}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleDisponible(product)}
                      className="flex items-center gap-2"
                    >
                      {product.disponible ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <ToggleRight className="w-5 h-5" />
                          <span className="text-sm font-medium">Activo</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-400">
                          <ToggleLeft className="w-5 h-5" />
                          <span className="text-sm font-medium">Inactivo</span>
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openModal(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
                  <select
                    required
                    value={form.categoria_id}
                    onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#dc2626]"
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="100"
                    value={form.precio}
                    onChange={(e) => setForm({ ...form, precio: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#dc2626]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio Oferta</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={form.precio_oferta}
                    onChange={(e) => setForm({ ...form, precio_oferta: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#dc2626]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#dc2626]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tiempo prep. (min)</label>
                  <input
                    type="number"
                    min="1"
                    value={form.tiempo_preparacion}
                    onChange={(e) => setForm({ ...form, tiempo_preparacion: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#dc2626]"
                  />
                </div>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ingredientes</label>
                <textarea
                  rows={2}
                  value={form.ingredientes}
                  onChange={(e) => setForm({ ...form, ingredientes: e.target.value })}
                  placeholder="Separados por comas"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagen</label>
                <div className="flex items-center gap-4">
                  {form.imagen && (
                    <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden">
                      <img src={form.imagen} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <label className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors">
                    <Upload className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">
                      {uploading ? "Subiendo..." : "Subir imagen"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.disponible}
                    onChange={(e) => setForm({ ...form, disponible: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-[#dc2626] focus:ring-[#dc2626]"
                  />
                  <span className="text-sm font-medium text-gray-700">Disponible</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.destacado}
                    onChange={(e) => setForm({ ...form, destacado: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-[#dc2626] focus:ring-[#dc2626]"
                  />
                  <span className="text-sm font-medium text-gray-700">Producto destacado</span>
                </label>
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
                  {editingProduct ? "Guardar Cambios" : "Crear Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
