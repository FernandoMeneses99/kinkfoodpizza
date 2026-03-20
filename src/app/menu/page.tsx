"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, ShoppingBag, Wifi, ThumbsUp, ArrowRight, Filter, Phone, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MenuPage() {
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(true);
  const [activeCategory, setActiveCategory] = useState("pizzas");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPreloaderVisible(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    { id: "pizzas", label: "Pizzas", icon: "🍕", color: "from-orange-400 to-red-500" },
    { id: "hamburguesas", label: "Hamburguesas", icon: "🍔", color: "from-amber-500 to-yellow-500" },
    { id: "postres", label: "Postres", icon: "🍨", color: "from-amber-400 to-orange-500" },
    { id: "ensaladas", label: "Ensaladas", icon: "🥗", color: "from-green-400 to-green-600" },
    { id: "bebidas", label: "Bebidas", icon: "🥤", color: "from-blue-400 to-blue-600" },
  ];

  const products = {
    pizzas: [
      { name: "Margherita Clásica", price: 24000, oldPrice: null, rating: 5, image: "🍕", badge: "Más Vendida", desc: "Salsa tomate, mozzarella, albahaca" },
      { name: "Pepperoni Supreme", price: 28000, oldPrice: 35000, rating: 5, image: "🍕", badge: "Oferta", desc: "Doble pepperoni, mozzarella" },
      { name: "Hawaiana Tropical", price: 26000, oldPrice: null, rating: 4, image: "🍕", badge: null, desc: "Jamón, piña, mozzarella" },
      { name: "Vegetariana Fresh", price: 25000, oldPrice: null, rating: 4, image: "🥗", badge: null, desc: "Verduras frescas, queso feta" },
      { name: " quattro Formaggi", price: 32000, oldPrice: null, rating: 5, image: "🧀", badge: "Premium", desc: "Mozzarella, gorgonzola, parmesan" },
      { name: "BBQ Chicken", price: 29000, oldPrice: null, rating: 5, image: "🍗", badge: "Nueva", desc: "Pollo BBQ, tocino, cebolla" },
      { name: "Mexicana Picante", price: 27000, oldPrice: null, rating: 4, image: "🌶️", badge: null, desc: "Carne, jalapeño, nachos" },
      { name: "Mediterránea", price: 30000, oldPrice: null, rating: 5, image: "🌿", badge: null, desc: "Aceitunas, jamón serrano, alcachofa" },
    ],
    hamburguesas: [
      { name: "Clásica Sencilla", price: 13000, oldPrice: null, rating: 4, image: "🍔", badge: null, desc: "Carne, queso, lechuga, tomate" },
      { name: "Doble Carne", price: 17000, oldPrice: null, rating: 5, image: "🍔", badge: "Popular", desc: "Doble carne, doble queso" },
      { name: "Pollo Crispy", price: 16000, oldPrice: null, rating: 4, image: "🍗", badge: null, desc: "Pollo empanizado, tocineta" },
      { name: "Mixta Premium", price: 23000, oldPrice: null, rating: 5, image: "🥩", badge: "Hot", desc: "Pollo + carne, tocina, huevo" },
      { name: "Veggie Burger", price: 15000, oldPrice: null, rating: 4, image: "🥬", badge: null, desc: "Hamburguesa de quinoa" },
      { name: "Bacon Ultimate", price: 20000, oldPrice: null, rating: 5, image: "🥓", badge: null, desc: "Doble tocino, cheddar" },
    ],
    postres: [
      { name: "Brownie Chocolate", price: 12000, oldPrice: 15000, rating: 5, image: "🍫", badge: "Oferta", desc: "Brownie con helado de vainilla" },
      { name: "Cheesecake", price: 14000, oldPrice: null, rating: 5, image: "🍰", badge: "Nueva", desc: "Cheesecake de fresa" },
      { name: "Tiramisu", price: 15000, oldPrice: null, rating: 5, image: "☕", badge: null, desc: "Postre italiano clásico" },
      { name: "Volcán de Chocolate", price: 16000, oldPrice: null, rating: 5, image: "🌋", badge: "Popular", desc: "Chocolate fundido" },
      { name: "Helado Artesanal", price: 8000, oldPrice: null, rating: 4, image: "🍨", badge: null, desc: "3 bolas a elección" },
      { name: "Frutas con Crema", price: 10000, oldPrice: null, rating: 4, image: "🍓", badge: null, desc: "Frutas frescas con crema" },
    ],
    ensaladas: [
      { name: "Ensalada César", price: 18000, oldPrice: null, rating: 5, image: "🥗", badge: "Clásica", desc: "Lechuga, pollo, crutones, aderezo César" },
      { name: "Ensalada de Frutas", price: 15000, oldPrice: null, rating: 4, image: "🍓", badge: null, desc: "Frutas mixtas con miel" },
      { name: "Ensalada Mixta", price: 14000, oldPrice: null, rating: 4, image: "🥬", badge: null, desc: "Verduras variada" },
      { name: "Ensalada Premium", price: 22000, oldPrice: 28000, rating: 5, image: "🥗", badge: "Oferta", desc: "Quinoa, avocado, salmón" },
    ],
    bebidas: [
      { name: "Limonada Natural", price: 6000, oldPrice: null, rating: 5, image: "🍋", badge: null, desc: "Limón natural" },
      { name: "Jugo de Fruits", price: 7000, oldPrice: null, rating: 4, image: "🧃", badge: null, desc: "Combinación de frutas" },
      { name: "Gaseosa", price: 4000, oldPrice: null, rating: 4, image: "🥤", badge: null, desc: "Variedad de marcas" },
      { name: "Cerveza Artesanal", price: 12000, oldPrice: null, rating: 5, image: "🍺", badge: null, desc: "Cerveza colombiana" },
      { name: "Vino Tinto", price: 25000, oldPrice: null, rating: 5, image: "🍷", badge: null, desc: "Copa de vino" },
      { name: "Agua Mineral", price: 3000, oldPrice: null, rating: 5, image: "💧", badge: null, desc: "Con gas / sin gas" },
    ],
  };

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
                <span className="mr-2">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black text-[#dc2626]">
                {categories.find(c => c.id === activeCategory)?.label}
              </h2>
              <p className="text-gray-600">{products[activeCategory as keyof typeof products].length} productos disponibles</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-gray-600">
              <Filter className="w-5 h-5" />
              <span>Filtrar</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products[activeCategory as keyof typeof products].map((product, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 group"
              >
                {/* Image */}
                <div className="relative h-40 bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center overflow-hidden">
                  <span className="text-6xl transform group-hover:scale-110 transition-transform">{product.image}</span>
                  {product.badge && (
                    <span className={`absolute top-3 right-3 px-3 py-1 text-xs font-bold rounded-full ${
                      product.badge === 'Oferta' ? 'bg-red-500 text-white' :
                      product.badge === 'Nueva' ? 'bg-green-500 text-white' :
                      product.badge === 'Popular' ? 'bg-yellow-500 text-gray-800' :
                      product.badge === 'Premium' ? 'bg-purple-500 text-white' :
                      'bg-[#dc2626] text-white'
                    }`}>
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  {/* Rating */}
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-gray-800 text-lg mb-1">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-3">{product.desc}</p>

                  {/* Price & Button */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-black text-[#dc2626]">${product.price.toLocaleString()}</span>
                      {product.oldPrice && (
                        <span className="ml-2 text-sm text-gray-400 line-through">${product.oldPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <button className="w-10 h-10 bg-[#dc2626] rounded-full flex items-center justify-center text-white hover:bg-[#991b1b] transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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