"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, MapPin, Facebook, Instagram, Menu, X, User, Settings, ShoppingCart } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

interface Configuracion {
  horario_apertura?: string;
  horario_cierre?: string;
  whatsapp?: string;
  telefono?: string;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<Configuracion>({});
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchConfig();
    fetchCartCount();
  }, [user]);

  useEffect(() => {
    updateOpenStatus();
    const interval = setInterval(updateOpenStatus, 60000);
    return () => clearInterval(interval);
  }, [config]);

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/config");
      const data = await res.json();
      if (data.negocio) {
        setConfig(data.negocio);
      }
    } catch (error) {
      console.error("Error fetching config:", error);
    }
  };

  const fetchCartCount = async () => {
    if (!user || user.rol === 'admin') {
      setCartCount(0);
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("/api/canasta", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.items) {
        const count = data.items.reduce((sum: number, item: { cantidad: number }) => sum + item.cantidad, 0);
        setCartCount(count);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  const updateOpenStatus = () => {
    const apertura = config.horario_apertura || '10:00';
    const cierre = config.horario_cierre || '22:00';
    
    const [openHour] = apertura.split(':').map(Number);
    const [closeHour] = cierre.split(':').map(Number);
    
    const now = new Date();
    const currentHour = now.getHours();
    
    if (closeHour < openHour) {
      setIsOpen(currentHour >= openHour || currentHour < closeHour);
    } else {
      setIsOpen(currentHour >= openHour && currentHour < closeHour);
    }
  };

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/menu", label: "Menú" },
    { href: "/nosotros", label: "Nosotros" },
    { href: "/contacto", label: "Contacto" },
  ];

  const whatsappNumber = config.whatsapp || '3009047298';
  const telefono = config.telefono || '3133844720';

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-xs">
            <div className="hidden md:flex items-center gap-5">
              <a href={`tel:${telefono.replace(/-/g, '')}`} className="flex items-center gap-1.5 hover:text-red-400 transition-colors">
                <Phone className="w-3.5 h-3.5" />
                <span>{telefono}</span>
              </a>
              <span className="text-gray-500">|</span>
              <span className="flex items-center gap-1.5 text-gray-400">
                <MapPin className="w-3.5 h-3.5" />
                Bogotá, Colombia
              </span>
            </div>
            <div className="flex items-center gap-4">
              {/* Estado abierto/cerrado */}
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">
                <span 
                  className={`w-4 h-4 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}
                  style={isOpen ? { boxShadow: '0 0 10px #22c55e, 0 0 20px #22c55e', animation: 'pulse-green 1.5s ease-in-out infinite' } : { boxShadow: '0 0 10px #ef4444, 0 0 20px #ef4444' }}
                ></span>
                <span className={`text-xs font-bold uppercase ${isOpen ? 'text-green-400' : 'text-red-400'}`}>
                  {isOpen ? 'Abierto' : 'Cerrado'}
                </span>
                <span className="text-white/70 text-xs hidden sm:inline">
                  · {config.horario_apertura || '10:00'} - {config.horario_cierre || '22:00'}
                </span>
              </div>
              <span className="text-gray-600">|</span>
              <div className="flex items-center gap-3">
                <a 
                  href={`https://wa.me/57${whatsappNumber.replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                  title="WhatsApp"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
                <a href="#" className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/90 backdrop-blur-md shadow-lg' 
          : 'bg-gradient-to-r from-red-700 to-red-800 shadow-md'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-14 h-14 lg:w-16 lg:h-16 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/30">
                <Image
                  src="/images/logo-198x66.png"
                  alt="Krokori Logo"
                  fill
                  className="object-contain p-1"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl lg:text-2xl font-black text-red-100 tracking-tight">KROKORI</span>
                <p className="text-[10px] text-yellow-300 -mt-1 tracking-widest uppercase">Fast Food</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-5 py-2 text-sm font-medium text-red-100 hover:text-red-300 hover:bg-white/10 rounded-lg transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 lg:gap-3">
              {/* Admin Button */}
              {user?.rol === 'admin' && (
                <Link 
                  href="/admin" 
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              )}

              {/* User Menu */}
              {user ? (
                <div className="hidden md:flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full">
                    <div className="w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-gray-900 text-xs font-bold">
                        {user.nombre.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-red-100 font-medium">
                      {user.nombre.split(' ')[0]}
                    </span>
                  </div>
                  <Link 
                    href="/cliente/ordenes" 
                    className="p-2 text-red-100/90 hover:text-red-100 hover:bg-white/10 rounded-xl transition-all"
                    title="Mis Pedidos"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                  <button 
                    onClick={logout} 
                    className="text-sm text-red-200/60 hover:text-yellow-400 transition-colors"
                    title="Cerrar Sesión"
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <Link 
                  href="/cliente/login" 
                  className="hidden md:flex items-center gap-2 px-4 py-2 text-red-100 hover:bg-white/10 rounded-xl font-medium text-sm transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Ingresar</span>
                </Link>
              )}

              {/* Cart Button */}
              {user?.rol !== 'admin' && (
                <Link 
                  href="/cliente/menu"
                  className="relative flex items-center gap-2 bg-yellow-400 text-gray-900 px-4 lg:px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/30 hover:-translate-y-0.5"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">Ordenar</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce shadow-lg">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button 
                className="lg:hidden p-2 text-red-100 hover:bg-white/10 rounded-xl transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-black/90 backdrop-blur-md border-t border-white/20 shadow-xl">
            <div className="container mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-red-100 font-medium rounded-lg hover:bg-white/10 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="border-t border-white/20 my-3 pt-3 space-y-1">
                {user?.rol === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-red-100 font-medium rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    Dashboard Admin
                  </Link>
                )}
                
                {user ? (
                  <>
                    <Link
                      href="/cliente/ordenes"
                      onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-red-100 font-medium rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <User className="w-5 h-5" />
                      Mis Pedidos
                    </Link>
                    <button 
                      onClick={() => { logout(); setIsMenuOpen(false); }}
                      className="w-full text-left flex items-center gap-3 px-4 py-3 text-yellow-400 font-medium rounded-lg hover:bg-yellow-400/10 transition-colors"
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <Link
                    href="/cliente/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-900 font-bold rounded-lg bg-yellow-400"
                  >
                    <User className="w-5 h-5" />
                    Iniciar Sesión
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
