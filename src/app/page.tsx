"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Leaf, Pizza, Hamburger, IceCream, Coffee, Beef, Star, ArrowRight, Clock, Truck, Award, Facebook, Twitter, Instagram } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPreloaderVisible(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const menuCategories = [
    { name: "Ensaladas", icon: Leaf, image: "/images/menu-1-370x278.jpg", color: "from-green-100 to-green-200" },
    { name: "Pizzas", icon: Pizza, image: "/images/menu-2-370x278.jpg", color: "from-orange-100 to-orange-200" },
    { name: "Hamburguesas", icon: Hamburger, image: "/images/menu-3-370x278.jpg", color: "from-amber-100 to-amber-200" },
    { name: "Postres", icon: IceCream, image: "/images/menu-4-370x278.jpg", color: "from-red-50 to-orange-100" },
    { name: "Bebidas", icon: Coffee, image: "/images/menu-5-370x278.jpg", color: "from-blue-100 to-blue-200" },
    { name: "Carnes", icon: Beef, image: "/images/menu-6-370x278.jpg", color: "from-red-100 to-red-200" },
  ];

  const heroSlides = [
    { 
      image: "/images/slide-1-1920x75.jpg", 
      title: "LA MEJOR PIZZA DE BOGOTÁ", 
      subtitle: "🍕",
      text: "Experimenta el sabor de una preparación perfecta con ingredientes frescos y masa madurada 72 horas",
      cta: "Ver Menú",
      ctaLink: "/menu"
    },
    { 
      image: "/images/slide-2-1920x753.jpg", 
      title: "INGREDIENTES 100% FRESCOS", 
      subtitle: "🥬",
      text: "Directos de granjas orgánicas de Boyacá. Sabor autentico en cada mordida",
      cta: "Conócenos",
      ctaLink: "/nosotros"
    },
  ];

  const testimonials = [
    { name: "Ashley Fitzgerald", text: "La mejor pizzeria de Bogotá. Los precios son excelentes y el sabor es increíble.", rating: 5 },
    { name: "Carlos Martínez", text: "Pizza deliciosa con masa perfecta. El servicio es rápido y amable.", rating: 5 },
    { name: "Maria Gómez", text: "Mi familia ama Krokori. Los domingos siempre Pedimos pizza aquí.", rating: 5 },
    { name: "Juan Pérez", text: "Excelente relación calidad-precio. Recomendado 100%.", rating: 4 },
  ];

  const whyChooseUs = [
    { icon: Clock, title: "Masa Madurada", desc: "72 horas de fermentación para textura perfecta", color: "bg-orange-500" },
    { icon: Leaf, title: "Ingredientes Frescos", desc: "Granjas orgánicas de Boyacá", color: "bg-green-500" },
    { icon: Award, title: "10+ Años", desc: "Experiencia y calidad garantizada", color: "bg-yellow-500" },
    { icon: Truck, title: "Domicilio Gratis", desc: "Por compras de +$70.000", color: "bg-red-500" },
  ];

  const popularProducts = [
    { name: "Pizza Margherita", price: "$24.000", image: "🍕", badge: "Más Vendida" },
    { name: "Hamburguesa Doble", price: "$17.000", image: "🍔", badge: "Nueva" },
    { name: "Pizza Pepperoni", price: "$28.000", image: "🍕", badge: null },
    { name: "Ensalada César", price: "$18.000", image: "🥗", badge: "Fresca" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  if (isPreloaderVisible) {
    return (
      <div className="preloader">
        <div className="pen">
          <div className="line-triangle">
            <div className="triangle"></div>
            <div className="triangle"></div>
            <div className="triangle"></div>
            <div className="triangle"></div>
            <div className="triangle"></div>
            <div className="triangle"></div>
            <div className="triangle"></div>
          </div>
          <div className="line-triangle">
            <div className="triangle"></div>
            <div className="triangle"></div>
            <div className="triangle"></div>
            <div className="triangle"></div>
            <div className="triangle"></div>
            <div className="triangle"></div>
            <div className="triangle"></div>
          </div>
          <div className="line-triangle">
            <div className="triangle"></div>
            <div className="triangle"></div>
            <div className="triangle"></div>
            <div className="triangle"></div>
            <div className="triangle"></div>
            <div className="triangle"></div>
            <div className="triangle"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Slider */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === heroSlide ? 'opacity-100' : 'opacity-0'}`}
            style={{ 
              background: index === 0 
                ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' 
                : 'linear-gradient(135deg, #dc2626 0%, #991b1b 50%, #7f1d1d 100%)'
            }}
          >
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="container mx-auto px-4 h-full flex items-center relative">
              <div className="max-w-2xl text-white">
                <div className="text-8xl mb-4">{slide.subtitle}</div>
                <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">{slide.title}</h1>
                <p className="text-lg md:text-xl mb-8 text-white/90">{slide.text}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href={slide.ctaLink} className="bg-white text-[#dc2626] px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors text-center shadow-lg">
                    {slide.cta}
                  </Link>
                  <Link href="/contacto" className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-[#dc2626] transition-colors text-center">
                    Contáctanos
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setHeroSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === heroSlide ? 'bg-white w-8' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 text-center group">
                  <div className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Menu Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#dc2626] mb-4">NUESTRO MENÚ</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Explora nuestra variedad de platos preparados con los mejores ingredientes</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {menuCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Link 
                  key={index} 
                  href="/menu"
                  className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                    <IconComponent className="w-16 h-16 text-[#dc2626]" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                    <h3 className="text-white font-bold text-lg">{category.name}</h3>
                  </div>
                  <div className="absolute inset-0 bg-[#dc2626]/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-bold">Ver más</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/menu" className="inline-flex items-center gap-2 bg-[#dc2626] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#991b1b] transition-colors shadow-lg hover:shadow-xl">
              Ver Menú Completo
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-20 bg-gradient-to-r from-[#dc2626] to-[#991b1b]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">POPULARES</h2>
            <p className="text-xl text-white/80">Los platos más pedidos por nuestros clientes</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.map((product, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
                <div className="relative h-32 bg-gradient-to-br from-red-50 to-orange-100 rounded-xl mb-4 flex items-center justify-center">
                  <span className="text-5xl">{product.image}</span>
                  {product.badge && (
                    <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded ${product.badge === 'Más Vendida' ? 'bg-yellow-400 text-gray-800' : 'bg-green-500 text-white'}`}>
                      {product.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-[#dc2626]">{product.price}</span>
                  <Link href="/menu" className="bg-[#dc2626] text-white p-2 rounded-full hover:bg-[#991b1b] transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#dc2626] mb-4">LO QUE DICEN</h2>
            <p className="text-xl text-gray-600">Nuestros clientes satisfechos</p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-xl text-gray-700 text-center italic mb-8">&#8220;{testimonials[currentSlide].text}&#8221;</p>
              <div className="flex items-center justify-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#dc2626] to-[#991b1b] rounded-full flex items-center justify-center text-2xl text-white font-bold">
                  {testimonials[currentSlide].name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{testimonials[currentSlide].name}</h4>
                  <div className="flex gap-1">
                    {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white rounded-full p-3 shadow-lg hover:bg-[#dc2626] hover:text-white transition-colors"
            >
              ←
            </button>
            <button 
              onClick={() => setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white rounded-full p-3 shadow-lg hover:bg-[#dc2626] hover:text-white transition-colors"
            >
              →
            </button>

            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-[#dc2626]' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿LISTO PARA ORDENAR?</h2>
          <p className="text-xl text-gray-300 mb-8">Llama ahora o visita nuestra ubicación</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:300-904-7298" className="bg-[#dc2626] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#991b1b] transition-colors flex items-center gap-2">
              📞 Llamar Ahora
            </a>
            <a href="/contacto" className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-[#dc2626] transition-colors">
              Ver Ubicación
            </a>
          </div>
        </div>
      </section>

      {/* Marquee Banner */}
      <section 
        className="py-4 overflow-hidden"
        style={{ background: 'linear-gradient(90deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)' }}
      >
        <div className="marquee-track flex animate-marquee">
          <span className="marquee-text text-5xl font-black text-[#d97706] mx-8">PIZZA</span>
          <span className="marquee-text text-5xl font-black text-[#ff8c48] mx-8">LASAGNA</span>
          <span className="marquee-text text-5xl font-black text-[#d97706] mx-8">HAMBURGUESAS</span>
          <span className="marquee-text text-5xl font-black text-[#dc2626] mx-8">MARISCOS</span>
          <span className="marquee-text text-5xl font-black text-[#d97706] mx-8">POSTRES</span>
          <span className="marquee-text text-5xl font-black text-[#ff8c48] mx-8">BEBIDAS</span>
          <span className="marquee-text text-5xl font-black text-[#d97706] mx-8">PIZZA</span>
          <span className="marquee-text text-5xl font-black text-[#ff8c48] mx-8">LASAGNA</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="bg-[#dc2626] rounded-xl p-3 inline-block mb-4">
                <div className="relative" style={{ width: 120, height: 40 }}>
                  <Image src="/images/logo-198x662.png" alt="Krokori" fill className="object-contain" unoptimized />
                </div>
              </div>
              <p className="text-gray-400">La mejor pizzeria artesanal en Bogotá. Ingredientes frescos, masa madurada y sabor único.</p>
            </div>

            <div>
              <h5 className="text-lg font-bold mb-4 text-[#dc2626]">Enlaces</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-[#dc2626]">• Inicio</Link></li>
                <li><Link href="/nosotros" className="hover:text-[#dc2626]">• Nosotros</Link></li>
                <li><Link href="/menu" className="hover:text-[#dc2626]">• Menú</Link></li>
                <li><Link href="/contacto" className="hover:text-[#dc2626]">• Contacto</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-lg font-bold mb-4 text-[#dc2626]">Horario</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Lun-Jue: 12pm - 10pm</li>
                <li>Vie-Sáb: 12pm - 11pm</li>
                <li>Domingo: 1pm - 9pm</li>
              </ul>
            </div>

            <div>
              <h5 className="text-lg font-bold mb-4 text-[#dc2626]">Síguenos</h5>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-[#dc2626] rounded-full flex items-center justify-center hover:bg-[#991b1b] transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-[#dc2626] rounded-full flex items-center justify-center hover:bg-[#991b1b] transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-[#dc2626] rounded-full flex items-center justify-center hover:bg-[#991b1b] transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Krokori. Todos los derechos reservados. | Diseñado por NovaSoft S.A.S</p>
          </div>
        </div>
      </footer>
    </div>
  );
}