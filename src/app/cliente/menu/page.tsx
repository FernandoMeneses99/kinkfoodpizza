"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/providers/AuthProvider";

interface Producto {
  id: number;
  categoria_id: number;
  categoria_nombre: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  precio_oferta: number | null;
  imagen: string | null;
  disponible: boolean;
  destacado: boolean;
}

interface Categoria {
  id: number;
  nombre: string;
  slug: string;
  num_productos: number;
}

interface CanastaItem {
  producto_id: number;
  cantidad: number;
}

export default function MenuPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoria, setSelectedCategoria] = useState<number | null>(null);
  const [canasta, setCanasta] = useState<CanastaItem[]>([]);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    if (imagePath.startsWith('/')) {
      return imagePath;
    }
    return `/${imagePath}`;
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (user && user.rol === 'cliente') {
      fetchCanasta();
    } else {
      setCanasta([]);
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/productos"),
        fetch("/api/categorias"),
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

  const fetchCanasta = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("/api/canasta", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCanasta(data.items || []);
    } catch (error) {
      console.error("Error fetching canasta:", error);
    }
  };

  const addToCanasta = async (productoId: number) => {
    if (!user) {
      router.push("/cliente/login?redirect=/cliente/menu");
      return;
    }
    
    setAddingToCart(productoId);
    try {
      const token = localStorage.getItem("accessToken");
      const existingItem = canasta.find(item => item.producto_id === productoId);
      const cantidad = existingItem ? existingItem.cantidad + 1 : 1;
      
      await fetch("/api/canasta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ producto_id: productoId, cantidad }),
      });
      
      fetchCanasta();
    } catch (error) {
      console.error("Error adding to canasta:", error);
    } finally {
      setTimeout(() => setAddingToCart(null), 500);
    }
  };

  const removeFromCanasta = async (productoId: number) => {
    const item = canasta.find(i => i.producto_id === productoId);
    if (!item) return;
    
    try {
      const token = localStorage.getItem("accessToken");
      const newCantidad = item.cantidad - 1;
      
      await fetch("/api/canasta", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ producto_id: productoId, cantidad: newCantidad }),
      });
      
      fetchCanasta();
    } catch (error) {
      console.error("Error updating canasta:", error);
    }
  };

  const getCanastaCount = () => canasta.reduce((sum, item) => sum + item.cantidad, 0);

  const filteredProductos = selectedCategoria
    ? productos.filter((p) => p.categoria_id === selectedCategoria)
    : productos;

  const getCanastaCantidad = (productoId: number) => {
    const item = canasta.find(i => i.producto_id === productoId);
    return item?.cantidad || 0;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getCanastaTotal = () => {
    return canasta.reduce((sum, item) => {
      const producto = productos.find(p => p.id === item.producto_id);
      if (!producto) return sum;
      const precio = producto.precio_oferta || producto.precio;
      return sum + precio * item.cantidad;
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#dc2626] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#dc2626] to-[#991b1b] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">NUESTRO MENÚ</h1>
          <p className="text-xl text-white/80">Los mejores sabores de Bogotá</p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategoria(null)}
              className={`flex-shrink-0 px-6 py-3 rounded-full font-bold transition-all ${
                selectedCategoria === null
                  ? "bg-[#dc2626] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos
            </button>
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoria(cat.id)}
                className={`flex-shrink-0 px-6 py-3 rounded-full font-bold transition-all ${
                  selectedCategoria === cat.id
                    ? "bg-[#dc2626] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProductos.map((producto) => (
              <div
                key={producto.id}
                className={`bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all ${
                  !producto.disponible ? "opacity-60" : ""
                }`}
              >
                <div className="relative h-48 bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center overflow-hidden">
                  {getImageUrl(producto.imagen) ? (
                    <img
                      src={getImageUrl(producto.imagen)!}
                      alt={producto.nombre}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <span className={`text-6xl ${getImageUrl(producto.imagen) ? 'hidden' : ''}`}>🍕</span>
                  {producto.destacado && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full">
                      Destacado
                    </span>
                  )}
                  {producto.precio_oferta && (
                    <span className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                      Oferta
                    </span>
                  )}
                  {!producto.disponible && (
                    <span className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="px-4 py-2 bg-gray-800 text-white text-sm font-bold rounded-lg">
                        Agotado
                      </span>
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{producto.nombre}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {producto.descripcion || producto.categoria_nombre}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-black text-[#dc2626]">
                        {formatCurrency(producto.precio_oferta || producto.precio)}
                      </span>
                      {producto.precio_oferta && (
                        <span className="ml-2 text-sm text-gray-400 line-through">
                          {formatCurrency(producto.precio)}
                        </span>
                      )}
                    </div>

                    {producto.disponible ? (
                      getCanastaCantidad(producto.id) > 0 ? (
                        <div className="flex items-center gap-1 bg-[#dc2626] text-white rounded-full px-2 py-1">
                          <button
                            onClick={() => removeFromCanasta(producto.id)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold min-w-[24px] text-center">{getCanastaCantidad(producto.id)}</span>
                          <button
                            onClick={() => addToCanasta(producto.id)}
                            disabled={addingToCart === producto.id}
                            className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCanasta(producto.id)}
                          disabled={addingToCart === producto.id}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            addingToCart === producto.id
                              ? "bg-green-500 text-white scale-110"
                              : "bg-[#dc2626] text-white hover:bg-[#991b1b]"
                          }`}
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      )
                    ) : (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 text-gray-400">
                        <span className="text-xs">Agotado</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Botón flotante para ir al checkout */}
      {user?.rol === 'cliente' && getCanastaCount() > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <Link
            href="/cliente/canasta"
            className="flex items-center gap-3 bg-[#dc2626] text-white px-6 py-4 rounded-full font-bold shadow-lg hover:bg-[#991b1b] transition-all hover:scale-105"
          >
            <ShoppingCart className="w-6 h-6" />
            <span>Ver Canasta ({getCanastaCount()})</span>
            <span className="bg-white text-[#dc2626] px-3 py-1 rounded-full text-lg font-black">
              {formatCurrency(getCanastaTotal())}
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
