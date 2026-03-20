"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Leaf, Pizza, Hamburger, IceCream, Coffee, Beef, Star, ArrowRight, Clock, Truck, Award, Phone, MapPin, ChevronLeft, ChevronRight, Utensils, Users, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [popularProducts, setPopularProducts] = useState<any[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPreloaderVisible(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchPopularProducts();
  }, []);

  const fetchPopularProducts = async () => {
    try {
      const res = await fetch('/api/productos?random=true&limit=4&disponible=true');
      const data = await res.json();
      if (data.productos) {
        setPopularProducts(data.productos);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const menuCategories = [
    { name: "Pizzas", icon: Pizza, color: "from-red-500 to-red-600", image: "/images/menu-1-370x278.jpg" },
    { name: "Hamburguesas", icon: Hamburger, color: "from-amber-500 to-amber-600", image: "/public/images/Ultimate-bacon-smashed-web.webp" },
    { name: "Pastas", icon: Utensils, color: "from-yellow-500 to-yellow-600", image: "/images/menu-2-370x278.jpg" },
    { name: "Bebidas", icon: Coffee, color: "from-blue-500 to-blue-600", image: "/images/menu-5-370x278.jpg" },
    { name: "Ensaladas", icon: Leaf, color: "from-green-500 to-green-600", image: "/images/menu-4-370x278.jpg" },
    { name: "Postres", icon: IceCream, color: "from-purple-600 to-purple-700", image: "/images/menu-6-370x278.jpg" },
  ];

  const testimonials = [
    { name: "María García", city: "Chapinero", text: "La mejor pizza de Bogotá. La masa es perfecta y los ingredientes son súper frescos.", rating: 5 },
    { name: "Juan López", city: "Teusaquillo", text: "Increíble la calidad. El domicilio siempre llega a tiempo y la pizza llega caliente.", rating: 5 },
    { name: "Ana Martínez", city: "Usaquén", text: "Precios muy buenos para la calidad. El servicio es excelente y muy amable.", rating: 5 },
    { name: "Carlos Pinto", city: "Kennedy", text: "Llevo más de un año pidiendo y nunca me han defraudado. Espectacular!", rating: 4 },
  ];

  const whyChooseUs = [
    { icon: Clock, title: "Masa Artesanal", desc: "72 horas de fermentación", bg: "bg-red-100", iconBg: "bg-red-500" },
    { icon: Leaf, title: "Ingredientes Frescos", desc: "Directos de Boyacá", bg: "bg-green-100", iconBg: "bg-green-500" },
    { icon: Award, title: "10+ Años", desc: "Experiencia garantizada", bg: "bg-yellow-100", iconBg: "bg-yellow-500" },
    { icon: Truck, title: "Domicilio Gratis", desc: "Pedidos +$70.000", bg: "bg-blue-100", iconBg: "bg-blue-500" },
  ];

  const stats = [
    { number: "10+", label: "Años", icon: Calendar },
    { number: "50K+", label: "Clientes", icon: Users },
    { number: "4.9", label: "Rating", icon: Star },
    { number: "100%", label: "Frescos", icon: Leaf },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

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

      {/* Hero Section - Mismo estilo que Nosotros */}
      <section className="relative py-20 md:py-28 bg-gradient-to-r from-[#dc2626] via-[#991b1b] to-[#7f1d1d]">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center text-white">
            <div className="text-7xl mb-4">🍕</div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">LA MEJOR PIZZA DE BOGOTÁ</h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Sabor que enamora, calidad que perdura. Experimenta el sabor de una preparación artesanal con ingredientes frescos y masa madurada 72 horas.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/menu" className="bg-white text-[#dc2626] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl inline-flex items-center justify-center gap-2">
                Ver Menú
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="tel:3009047298" className="border-2 border-white/50 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all inline-flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                300-904-7298
              </a>
            </div>
          </div>
        </div>
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-[#dc2626] rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-black text-[#dc2626]">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {whyChooseUs.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index} 
                  className="text-center p-6 rounded-2xl bg-white hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className={`w-14 h-14 ${item.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Menu Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-[#dc2626] mb-2">NUESTRO MENÚ</h2>
            <p className="text-gray-600">Explora nuestras categorías</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {menuCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Link 
                  key={index} 
                  href="/menu"
                  className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900">{category.name}</h3>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link 
              href="/menu" 
              className="inline-flex items-center gap-2 bg-[#dc2626] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#991b1b] transition-all shadow-lg hover:-translate-y-0.5"
            >
              Ver Menú Completo
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Products con imágenes reales */}
      <section className="py-16 bg-gradient-to-r from-[#dc2626] to-[#991b1b]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">LOS MÁS PEDIDOS</h2>
            <p className="text-red-100">Favoritos de nuestros clientes</p>
          </div>
          
          {popularProducts.length === 0 ? (
            <div className="text-center text-white/70 py-8">
              <p>No hay productos disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularProducts.map((product, index) => (
                <div 
                  key={product.id || index}
                  className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
                >
                  <div className="h-40 bg-gray-200 relative overflow-hidden">
                    {product.imagen ? (
                      <Image
                        src={product.imagen}
                        alt={product.nombre}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Pizza className="w-16 h-16 text-gray-300" />
                      </div>
                    )}
                    {product.destacado && (
                      <span className="absolute top-3 right-3 px-3 py-1 text-xs font-bold rounded bg-yellow-400 text-gray-900">
                        Destacado
                      </span>
                    )}
                    {product.precio_oferta && (
                      <span className="absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded bg-green-500 text-white">
                        Oferta
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-1">{product.nombre}</h3>
                    <p className="text-xs text-gray-500 mb-2">{product.categoria_nombre}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        {product.precio_oferta ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-black text-[#dc2626]">
                              ${product.precio_oferta.toLocaleString('es-CO')}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              ${product.precio.toLocaleString('es-CO')}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xl font-black text-[#dc2626]">
                            ${product.precio.toLocaleString('es-CO')}
                          </span>
                        )}
                      </div>
                      <Link 
                        href="/menu" 
                        className="p-2 bg-[#dc2626] text-white rounded-lg hover:bg-[#991b1b] transition-colors"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-[#dc2626] mb-2">LO QUE DICEN</h2>
            <p className="text-gray-600">Nuestros clientes</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-lg md:text-xl text-gray-700 italic mb-8">
                "{testimonials[currentSlide].text}"
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="w-14 h-14 bg-[#dc2626] rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {testimonials[currentSlide].name.charAt(0)}
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-gray-900">{testimonials[currentSlide].name}</h4>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {testimonials[currentSlide].city}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentSlide ? 'bg-[#dc2626] w-8' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#dc2626] to-[#991b1b]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">¿LISTO PARA ORDENAR?</h2>
          <p className="text-white/80 mb-8">Llámanos o visita nuestra ubicación</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:3009047298" 
              className="inline-flex items-center justify-center gap-2 bg-white text-[#dc2626] px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg"
            >
              <Phone className="w-5 h-5" />
              300-904-7298
            </a>
            <Link 
              href="/contacto" 
              className="inline-flex items-center justify-center gap-2 border-2 border-white/50 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all"
            >
              <MapPin className="w-5 h-5" />
              Ver Ubicación
            </Link>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="py-4 overflow-hidden bg-gray-900">
        <div className="marquee-track flex animate-marquee">
          <span className="marquee-text text-4xl md:text-5xl font-black text-[#dc2626] mx-8">PIZZA</span>
          <span className="marquee-text text-4xl md:text-5xl font-black text-yellow-400 mx-8">LASAGNA</span>
          <span className="marquee-text text-4xl md:text-5xl font-black text-[#dc2626] mx-8">HAMBURGUESAS</span>
          <span className="marquee-text text-4xl md:text-5xl font-black text-orange-400 mx-8">PASTA</span>
          <span className="marquee-text text-4xl md:text-5xl font-black text-yellow-400 mx-8">POSTRES</span>
          <span className="marquee-text text-4xl md:text-5xl font-black text-[#dc2626] mx-8">BEBIDAS</span>
        </div>
      </section>

      <Footer />
    </div>
  );
}
