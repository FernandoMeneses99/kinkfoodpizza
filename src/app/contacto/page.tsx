"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, MapPin, Mail, Facebook, Twitter, Instagram, Linkedin, Send, MessageCircle, Clock, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactoPage() {
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPreloaderVisible(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const contactInfo = [
    { icon: Phone, label: "Teléfono", value: "300-904-7298", subvalue: "313-384-4720", color: "from-blue-500 to-blue-600" },
    { icon: MapPin, label: "Ubicación", value: "Bogotá, Colombia", subvalue: "Cl. 123 #45-67, Zona Rosa", color: "from-[#dc2626] to-[#991b1b]" },
    { icon: Mail, label: "Email", value: "info@Krokori.org", subvalue: "Reservas y pedidos", color: "from-orange-500 to-orange-600" },
    { icon: Clock, label: "Horario", value: "Lun-Sáb: 12pm - 10pm", subvalue: "Dom: 1pm - 9pm", color: "from-green-500 to-green-600" },
  ];

  const services = [
    "Cenar en el Restaurante",
    "Comida para Llevar", 
    "Domicilio a Domicilio",
    "Catering para Eventos",
    "Reservaciones Especiales",
    "Otro"
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
        <div className="container mx-auto px-4 relative text-center text-white">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-12 h-12" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4">CONTÁCTANOS</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">Estamos aquí para ayudarte. Contáctanos por el medio que prefieras</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 -mt-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all hover:-translate-y-1 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-1">{info.label}</h4>
                  <p className="text-[#dc2626] font-bold">{info.value}</p>
                  <p className="text-gray-500 text-sm">{info.subvalue}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-r from-[#dc2626] to-[#991b1b] rounded-2xl flex items-center justify-center">
                    <Send className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">Envíanos un Mensaje</h2>
                    <p className="text-gray-600">Te responderemos lo más pronto posible</p>
                  </div>
                </div>

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Mensaje Enviado!</h3>
                    <p className="text-gray-600">Gracias por contactarnos. Te responderemos pronto.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Tu Nombre *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#dc2626] transition-colors"
                          placeholder="Ej: Juan García"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Tu Correo *</label>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#dc2626] transition-colors"
                          placeholder="Ej: juan@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Selecciona un Servicio</label>
                      <select 
                        value={formData.service}
                        onChange={(e) => setFormData({...formData, service: e.target.value})}
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#dc2626] transition-colors"
                      >
                        <option value="">Selecciona una opción</option>
                        {services.map((service, i) => (
                          <option key={i} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Tu Mensaje</label>
                      <textarea 
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#dc2626] transition-colors resize-none"
                        placeholder="Cuéntanos cómo podemos ayudarte..."
                      ></textarea>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#dc2626] to-[#991b1b] text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Enviar Mensaje
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* WhatsApp CTA */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-8 text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">WhatsApp</h3>
                <p className="text-white/80 mb-4">La forma más rápida de contactarnos</p>
                <a 
                  href="https://wa.me/573009047298" 
                  className="inline-block bg-white text-green-600 px-6 py-3 rounded-full font-bold hover:bg-green-50 transition-colors"
                >
                  300-904-7298
                </a>
              </div>

              {/* Social */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Síguenos</h3>
                <p className="text-gray-600 mb-6">Mantente conectado con nuestras promociones</p>
                <div className="grid grid-cols-4 gap-4">
                  <a href="#" className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform">
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform">
                    <Twitter className="w-6 h-6" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-gradient-to-br from-purple-600 via-orange-400 to-red-500 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform">
                    <Instagram className="w-6 h-6" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform">
                    <Linkedin className="w-6 h-6" />
                  </a>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-900 rounded-3xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Acciones Rápidas</h3>
                <div className="space-y-3">
                  <Link href="/menu" className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                    <span className="text-2xl">🍕</span>
                    <span className="font-medium">Ver Menú Completo</span>
                  </Link>
                  <Link href="/nosotros" className="flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                    <span className="text-2xl">👨‍🍳</span>
                    <span className="font-medium">Conocer Nuestro Equipo</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-[#dc2626] mb-4">NUESTRA UBICACIÓN</h2>
            <p className="text-gray-600 text-lg">Visítanos y disfruta de la mejor experiencia</p>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-orange-100 rounded-3xl h-[400px] flex items-center justify-center overflow-hidden">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#dc2626] rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Bogotá, Colombia</h3>
              <p className="text-gray-600 mb-4">Cl. 123 #45-67, Zona Rosa</p>
              <a 
                href="https://maps.google.com/?q=Bogota+Colombia" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#dc2626] text-white px-6 py-3 rounded-full font-bold hover:bg-[#991b1b] transition-colors"
              >
                Abrir en Google Maps
              </a>
            </div>
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
