"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Pizza, Leaf, Facebook, Twitter, Instagram, Award, Users, Calendar, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NosotrosPage() {
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPreloaderVisible(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    { id: 0, title: "Nosotros", icon: Pizza },
    { id: 1, title: "Misión", icon: Leaf },
    { id: 2, title: "Metas", icon: Star },
    { id: 3, title: "Valores", icon: Award },
  ];

  const team = [
    { name: "Richard Peterson", role: "Gerente General", image: "👨‍💼", color: "from-blue-400 to-blue-600" },
    { name: "Amelia Lee", role: "Jefe de Cocina", image: "👩‍🍳", color: "from-amber-400 to-orange-500" },
    { name: "Sam Peterson", role: "Jefe de Panadería", image: "👨‍🍳", color: "from-amber-400 to-amber-600" },
    { name: "Jane Smith", role: "Chef de Pizza", image: "👨‍🍕", color: "from-green-400 to-green-600" },
  ];

  const timeline = [
    { year: "2005", title: "Fundación", desc: "Apertura del primer local en Bogotá" },
    { year: "2012", title: "Domicilio Gratis", desc: "Lanzamos servicio gratuito por +$70.000" },
    { year: "2015", title: "Expansión", desc: "Ampliación del menú con Hamburguesas" },
    { year: "2019", title: "Alianzas", desc: "Granjas orgánicas de Boyacá" },
    { year: "2024", title: "Líderes", desc: "Mejor pizzeria de Bogotá" },
  ];

  const stats = [
    { number: "10+", label: "Años", icon: Calendar },
    { number: "50K+", label: "Clientes", icon: Users },
    { number: "4.9", label: "Rating", icon: Star },
    { number: "100%", label: "Frescos", icon: Leaf },
  ];

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

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-r from-[#dc2626] via-[#991b1b] to-[#7f1d1d]">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center text-white">
            <div className="text-8xl mb-4">🍕</div>
            <h1 className="text-5xl md:text-6xl font-black mb-4">NOSOTROS</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">Conocenos y descubre por qué somos la mejor opción en Bogotá</p>
            <div className="flex justify-center gap-4 mt-8">
              <Link href="/menu" className="bg-white text-[#dc2626] px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
                Ver Menú
              </Link>
              <Link href="/contacto" className="border-2 border-white text-white px-6 py-3 rounded-full font-bold hover:bg-white hover:text-[#dc2626] transition-colors">
                Contáctanos
              </Link>
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
                  <div className="w-16 h-16 bg-[#dc2626] rounded-full flex items-center justify-center mx-auto mb-3">
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

      {/* Tabs Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-24">
                <h3 className="text-2xl font-bold text-[#dc2626] mb-2">10+ Años</h3>
                <p className="text-gray-600 mb-6">de experiencia en Bogotá</p>
                
                <div className="space-y-3">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                          activeTab === tab.id 
                            ? 'bg-[#dc2626] text-white shadow-lg' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                        <span className="font-bold">{tab.title}</span>
                      </button>
                    );
                  })}
                </div>

                <Link href="/contacto" className="block text-center mt-8 bg-[#dc2626] text-white py-4 rounded-xl font-bold hover:bg-[#991b1b] transition-colors">
                  Contáctanos
                </Link>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
                {activeTab === 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-[#dc2626] to-[#991b1b] rounded-2xl flex items-center justify-center">
                        <Pizza className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-800">Nuestra Historia</h3>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Krokori nació en 2005 con la misión de traer la auténtica pizza italiana a Bogotá. 
                      Desde entonces, nos hemos convertido en referencia de la mejor pizza artesanal, 
                      combinando técnicas tradicionales con ingredientes frescos locales.
                    </p>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Cada pizza se prepara con masa madurada 72 horas, salsa casera y los mejores 
                      ingredientes de nuestra red de agricultores en Boyacá. Nuestro compromiso 
                      es la calidad en cada mordida.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-8">
                      <div className="bg-gradient-to-br from-red-50 to-orange-100 p-6 rounded-2xl text-center">
                        <span className="text-4xl">🍕</span>
                        <p className="font-bold text-gray-800 mt-2">50,000+</p>
                        <p className="text-sm text-gray-600">Pizzas vendidas</p>
                      </div>
                      <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-6 rounded-2xl text-center">
                        <span className="text-4xl">⭐</span>
                        <p className="font-bold text-gray-800 mt-2">4.9</p>
                        <p className="text-sm text-gray-600">Calificación</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                        <Leaf className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-800">Nuestra Misión</h3>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Brindar la mejor experiencia culinaria a través de pizzas artesanales 
                      preparadas con ingredientes 100% frescos y naturales, horneadas en 
                      horno de leña para garantizar sabor auténtico.
                    </p>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Trabajamos directamente con agricultores locales de Boyacá para 
                      garantizar productos orgánicos y de la más alta calidad en cada plato.
                    </p>
                    <div className="bg-green-50 p-6 rounded-2xl mt-6">
                      <h4 className="font-bold text-green-800 mb-2">🌱 Compromiso Verde</h4>
                      <p className="text-green-700">Todos nuestros ingredientes provienen de granjas orgánicas certificaciónes en Boyacá.</p>
                    </div>
                  </div>
                )}

                {activeTab === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                        <Star className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-800">Nuestras Metas</h3>
                    </div>
                    <div className="space-y-4">
                      {[
                        "Ser la pizzeria #1 en Bogotá y Colombia",
                        "Expandir nuestras ubicaciones manteniendo calidad",
                        "Innovar constantemente en sabores y recetas",
                        "Brindar el mejor servicio al cliente",
                        "Mantener precios accesibles con calidad premium"
                      ].map((meta, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                          <div className="w-10 h-10 bg-[#dc2626] rounded-full flex items-center justify-center text-white font-bold">
                            {i + 1}
                          </div>
                          <span className="text-gray-700 font-medium">{meta}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-800">Nuestros Valores</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { title: "Calidad", desc: "Solo los mejores ingredientes" },
                        { title: "Honestidad", desc: "Transparencia en todo" },
                        { title: "Dedicación", desc: "Pasión en cada pizza" },
                        { title: "Servicio", desc: "Cliente primero siempre" },
                      ].map((val, i) => (
                        <div key={i} className="bg-gradient-to-br from-[#dc2626]/10 to-[#dc2626]/5 p-6 rounded-2xl border border-[#dc2626]/20">
                          <h4 className="font-bold text-[#dc2626] text-xl mb-2">{val.title}</h4>
                          <p className="text-gray-600">{val.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#dc2626] mb-4">NUESTRO EQUIPO</h2>
            <p className="text-xl text-gray-600">Las personas detrás del mejor sabor</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div key={index} className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2">
                <div className={`h-40 bg-gradient-to-br ${member.color} flex items-center justify-center`}>
                  <span className="text-6xl">{member.image}</span>
                </div>
                <div className="p-6 text-center">
                  <h4 className="font-bold text-gray-800 text-lg">{member.name}</h4>
                  <p className="text-[#dc2626] font-medium">{member.role}</p>
                  <div className="flex justify-center gap-2 mt-4">
                    <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#dc2626] hover:text-white transition-colors">
                      <Facebook className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#dc2626] hover:text-white transition-colors">
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#dc2626] hover:text-white transition-colors">
                      <Instagram className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#dc2626] mb-4">NUESTRA TRAVESÍA</h2>
            <p className="text-xl text-gray-600">Un camino de crecimiento y excelencia</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#dc2626]"></div>
              
              {timeline.map((item, index) => (
                <div key={index} className={`flex items-center mb-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                      <span className="text-[#dc2626] font-black text-2xl">{item.year}</span>
                      <h4 className="font-bold text-gray-800 text-lg">{item.title}</h4>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-[#dc2626] rounded-full flex items-center justify-center z-10">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#dc2626] to-[#991b1b]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿Listo para probarnos?</h2>
          <p className="text-white/80 mb-8">Orderna ahora y disfruta de la mejor pizza de Bogotá</p>
          <Link href="/menu" className="inline-block bg-white text-[#dc2626] px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transition-all hover:scale-105">
            Ver Menú
          </Link>
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