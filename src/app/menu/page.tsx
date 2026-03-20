"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ShoppingBag, Wifi, ThumbsUp, ArrowRight, Filter, Phone, MapPin, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Categoria {
  id: number;
  nombre: string;
  icono: string;
}

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  precio_oferta: number | null;
  imagen: string | null;
  disponible: boolean;
  destacado: boolean;
  categoria_id: number;
  categoria_nombre: string;
}

export default function MenuPage() {
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(true);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [products, setProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dataFetched = useRef(false);

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

  const fallbackCategories: Categoria[] = [
    { id: 1, nombre: 'Pizzas', icono: '🍕' },
    { id: 2, nombre: 'Hamburguesas', icono: '🍔' },
    { id: 3, nombre: 'Pastas', icono: '🍝' },
    { id: 4, nombre: 'Bebidas', icono: '🥤' },
    { id: 5, nombre: 'Postres', icono: '🍰' },
    { id: 6, nombre: 'Ensaladas', icono: '🥗' },
  ];

  const fallbackProducts: Producto[] = [
    { id: 1, nombre: 'Margherita Clásica', descripcion: 'Salsa tomate, mozzarella, albahaca', precio: 24000, precio_oferta: null, imagen: null, disponible: true, destacado: true, categoria_id: 1, categoria_nombre: 'Pizzas' },
    { id: 2, nombre: 'Pepperoni Supreme', descripcion: 'Doble pepperoni, mozzarella', precio: 28000, precio_oferta: 25000, imagen: null, disponible: true, destacado: true, categoria_id: 1, categoria_nombre: 'Pizzas' },
    { id: 3, nombre: 'Hawaiana Tropical', descripcion: 'Jamón, piña, mozzarella', precio: 26000, precio_oferta: null, imagen: null, disponible: true, destacado: false, categoria_id: 1, categoria_nombre: 'Pizzas' },
    { id: 4, nombre: 'Clásica Americana', descripcion: 'Carne 200g, queso cheddar, vegetales', precio: 18000, precio_oferta: null, imagen: null, disponible: true, destacado: true, categoria_id: 2, categoria_nombre: 'Hamburguesas' },
    { id: 5, nombre: 'Doble Carne', descripcion: 'Doble carne, doble queso', precio: 25000, precio_oferta: 22000, imagen: null, disponible: true, destacado: true, categoria_id: 2, categoria_nombre: 'Hamburguesas' },
    { id: 6, nombre: 'Spaghetti Carbonara', descripcion: 'Pasta con salsa carbonara', precio: 22000, precio_oferta: null, imagen: null, disponible: true, destacado: false, categoria_id: 3, categoria_nombre: 'Pastas' },
    { id: 7, nombre: 'Limonada Natural', descripcion: 'Limón natural con hierbabuena', precio: 6000, precio_oferta: null, imagen: null, disponible: true, destacado: false, categoria_id: 4, categoria_nombre: 'Bebidas' },
    { id: 8, nombre: 'Tiramisú', descripcion: 'Postre italiano con café y mascarpone', precio: 15000, precio_oferta: null, imagen: null, disponible: true, destacado: true, categoria_id: 5, categoria_nombre: 'Postres' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPreloaderVisible(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (dataFetched.current) return;
      dataFetched.current = true;

      try {
        setLoading(true);
        
        const [catRes, prodRes] = await Promise.all([
          fetch('/api/categorias'),
          fetch('/api/productos')
        ]);

        if (!catRes.ok || !prodRes.ok) {
          const catData = await catRes.json().catch(() => ({}));
          const prodData = await prodRes.json().catch(() => ({}));
          
          if (catData.error || prodData.error) {
            throw new Error(catData.error || prodData.error || 'Error al cargar datos');
          }
        }

        const catData = await catRes.json();
        const prodData = await prodRes.json();

        if (catData.categorias?.length > 0) {
          setCategories(catData.categorias);
          setProducts(prodData.productos || []);
          setActiveCategory(catData.categorias[0].id);
        } else {
          setCategories(fallbackCategories);
          setProducts(fallbackProducts);
          setActiveCategory(1);
          setError('Base de datos no disponible - mostrando datos de ejemplo');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setCategories(fallbackCategories);
        setProducts(fallbackProducts);
        setActiveCategory(1);
        setError('Base de datos no disponible - mostrando datos de ejemplo');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredProducts = products.filter(p => p.categoria_id === activeCategory);
  const activeCategoryName = categories.find(c => c.id === activeCategory)?.nombre || '';

  if (isPreloaderVisible) {
    return (
      <div className="preloader">
        <div className="pen">
          {[0, 1, 2].map((i) => (
            <div key={i} className="line-triangle">
              {[...Array(7)].map((_, j) => (
                <div key={j} className="triangle"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative py-20 bg-gradient-to-r from-[#dc2626] via-[#991b1b] to-[#7f1d1d]">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative text-center text-white">
          <div className="text-8xl mb-4">🍕🌯🍔</div>
          <h1 className="text-5xl md:text-6xl font-black mb-4">NUESTRO MENÚ</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">Los mejores platos con ingredientes frescos y sabores auténticos</p>
        </div>
        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Category Navigation */}
      <div className="sticky top-16 bg-white shadow-lg z-40 py-4">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-[#dc2626]" />
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm text-center">
                  {error}
                </div>
              )}
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-6 py-2.5 rounded-full font-bold transition-all ${
                      activeCategory === cat.id 
                        ? 'bg-[#dc2626] text-white shadow-lg scale-105' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-2">{cat.icono || '🍽️'}</span>
                    {cat.nombre}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black text-[#dc2626]">
                {activeCategoryName}
              </h2>
              <p className="text-gray-600">{filteredProducts.length} productos disponibles</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-gray-600">
              <Filter className="w-5 h-5" />
              <span>Filtrar</span>
            </div>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-[#dc2626] mb-4" />
              <p className="text-gray-500">Cargando productos...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No hay productos en esta categoría</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 group ${
                    !product.disponible ? 'opacity-60' : ''
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-40 bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center overflow-hidden">
                    {getImageUrl(product.imagen) ? (
                      <img 
                        src={getImageUrl(product.imagen)!} 
                        alt={product.nombre}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <span className={`text-6xl transform group-hover:scale-110 transition-transform ${getImageUrl(product.imagen) ? 'hidden' : ''}`}>🍕</span>
                    {product.destacado && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full">
                        Destacado
                      </span>
                    )}
                    {product.precio_oferta && (
                      <span className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                        Oferta
                      </span>
                    )}
                    {!product.disponible && (
                      <span className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className="px-4 py-2 bg-gray-800 text-white text-sm font-bold rounded-lg">
                          Agotado
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    {/* Title */}
                    <h3 className="font-bold text-gray-800 text-lg mb-1">{product.nombre}</h3>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.descripcion || 'Delicioso platillo'}</p>

                    {/* Price & Button */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-black text-[#dc2626]">
                          ${(product.precio_oferta || product.precio).toLocaleString()}
                        </span>
                        {product.precio_oferta && (
                          <span className="ml-2 text-sm text-gray-400 line-through">
                            ${product.precio.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <button 
                        disabled={!product.disponible}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          product.disponible
                            ? 'bg-[#dc2626] text-white hover:bg-[#991b1b]'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-gradient-to-r from-[#dc2626] to-[#991b1b]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-xl mb-2">Domicilio Gratis</h4>
              <p className="text-white/80">Por compras de +$70.000</p>
            </div>
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wifi className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-xl mb-2">WiFi Gratis</h4>
              <p className="text-white/80">Para todos nuestros clientes</p>
            </div>
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ThumbsUp className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-xl mb-2">Mejor Servicio</h4>
              <p className="text-white/80">Cliente primero siempre</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿No encuentras lo que buscas?</h2>
          <p className="text-gray-400 mb-8">Llámanos y te ayudamos con tu pedido</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:300-904-7298" className="bg-[#dc2626] text-white px-8 py-4 rounded-full font-bold hover:bg-[#991b1b] transition-colors inline-flex items-center gap-2">
              <Phone className="w-5 h-5" />
              300-904-7298
            </a>
            <Link href="/contacto" className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-[#dc2626] transition-colors inline-flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Ver Ubicación
            </Link>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="py-4 overflow-hidden" style={{ background: 'linear-gradient(90deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)' }}>
        <div className="marquee-track flex animate-marquee">
          <span className="marquee-text text-5xl font-black text-[#d97706] mx-8">PIZZA</span>
          <span className="marquee-text text-5xl font-black text-[#ff8c48] mx-8">LASAGNA</span>
          <span className="marquee-text text-5xl font-black text-[#d97706] mx-8">HAMBURGUESAS</span>
          <span className="marquee-text text-5xl font-black text-[#dc2626] mx-8">MARISCOS</span>
          <span className="marquee-text text-5xl font-black text-[#d97706] mx-8">POSTRES</span>
        </div>
      </section>

      <Footer />
    </div>
  );
}
