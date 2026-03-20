"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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

export default function MenuPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoria, setSelectedCategoria] = useState<number | null>(null);
  const [canasta, setCanasta] = useState<{ [key: number]: number }>({});
  const [showCanasta, setShowCanasta] = useState(false);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
    const savedCanasta = localStorage.getItem("canasta");
    if (savedCanasta) {
      setCanasta(JSON.parse(savedCanasta));
    }
  }, []);

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

  const addToCanasta = (productoId: number) => {
    setAddingToCart(productoId);
    setCanasta((prev) => {
      const newCanasta = { ...prev, [productoId]: (prev[productoId] || 0) + 1 };
      localStorage.setItem("canasta", JSON.stringify(newCanasta));
      return newCanasta;
    });
    setTimeout(() => setAddingToCart(null), 500);
  };

  const removeFromCanasta = (productoId: number) => {
    setCanasta((prev) => {
      const newCanasta = { ...prev };
      if (newCanasta[productoId] > 1) {
        newCanasta[productoId]--;
      } else {
        delete newCanasta[productoId];
      }
      localStorage.setItem("canasta", JSON.stringify(newCanasta));
      return newCanasta;
    });
  };

  const getCanastaCount = () => Object.values(canasta).reduce((a, b) => a + b, 0);

  const filteredProductos = selectedCategoria
    ? productos.filter((p) => p.categoria_id === selectedCategoria)
    : productos;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
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
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
                  {producto.imagen ? (
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl">🍕</span>
                  )}
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

                    <button
                      onClick={() => producto.disponible && addToCanasta(producto.id)}
                      disabled={!producto.disponible || addingToCart === producto.id}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        !producto.disponible
                          ? "bg-gray-200 text-gray-400"
                          : addingToCart === producto.id
                          ? "bg-green-500 text-white scale-110"
                          : "bg-[#dc2626] text-white hover:bg-[#991b1b]"
                      }`}
                    >
                      {canasta[producto.id] ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromCanasta(producto.id);
                            }}
                            className="p-1"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold">{canasta[producto.id]}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCanasta(producto.id);
                            }}
                            className="p-1"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Canasta Sidebar */}
      {showCanasta && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCanasta(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Tu Canasta</h2>
                <button
                  onClick={() => setShowCanasta(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ✕
                </button>
              </div>

              {getCanastaCount() === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                  <ShoppingCart className="w-16 h-16 mb-4 opacity-50" />
                  <p>Tu canasta está vacía</p>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto space-y-4">
                    {productos
                      .filter((p) => canasta[p.id])
                      .map((producto) => (
                        <div key={producto.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                            {producto.imagen ? (
                              <img
                                src={producto.imagen}
                                alt={producto.nombre}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <span className="text-3xl">🍕</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{producto.nombre}</h4>
                            <p className="text-sm text-gray-500">
                              {formatCurrency(
                                (producto.precio_oferta || producto.precio) * canasta[producto.id]
                              )}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => removeFromCanasta(producto.id)}
                                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                              >
                                -
                              </button>
                              <span className="font-bold">{canasta[producto.id]}</span>
                              <button
                                onClick={() => addToCanasta(producto.id)}
                                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="pt-6 border-t">
                    <div className="flex justify-between mb-4">
                      <span className="text-lg font-medium">Total:</span>
                      <span className="text-2xl font-black text-[#dc2626]">
                        {formatCurrency(
                          productos
                            .filter((p) => canasta[p.id])
                            .reduce(
                              (sum, p) =>
                                sum +
                                (p.precio_oferta || p.precio) * (canasta[p.id] || 0),
                              0
                            )
                        )}
                      </span>
                    </div>

                    <Link
                      href={user ? "/cliente/canasta" : "/cliente/login?redirect=/cliente/canasta"}
                      onClick={() => setShowCanasta(false)}
                      className="block w-full py-4 bg-[#dc2626] text-white text-center rounded-xl font-bold hover:bg-[#991b1b] transition-colors"
                    >
                      {user ? "Ir al Checkout" : "Iniciar Sesión para Continuar"}
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
