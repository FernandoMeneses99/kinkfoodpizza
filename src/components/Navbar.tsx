"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Menu, X, User, Settings } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <>
      {/* Top Bar - Contacto y Redes */}
      <div className="hidden lg:block bg-[#dc2626] text-white">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <a href="tel:313-384-4720" className="text-sm hover:text-gray-200">313-384-4720</a>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Bogotá. Colombia</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://wa.me/573009047298" target="_blank" className="bg-[#d97706] text-gray-900 px-3 py-1 text-xs font-bold rounded animate-pulse">
              WhatsApp: 300-904-7298
            </a>
            <div className="flex items-center gap-3">
              <a href="#" className="hover:text-gray-200"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="hover:text-gray-200"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="hover:text-gray-200"><Instagram className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="bg-white shadow-lg relative z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="bg-[#dc2626] rounded-lg p-2">
                <div className="relative" style={{ width: 80, height: 45 }}>
                  <Image src="/images/logo-198x662.png" alt="Krokori" fill className="object-contain" unoptimized />
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/" className="text-gray-700 font-semibold text-sm uppercase hover:text-[#dc2626] transition-colors">Inicio</Link>
              <Link href="/nosotros" className="text-gray-700 font-semibold text-sm uppercase hover:text-[#dc2626] transition-colors">Nosotros</Link>
              <Link href="/menu" className="text-gray-700 font-semibold text-sm uppercase hover:text-[#dc2626] transition-colors">Menú</Link>
              <Link href="/contacto" className="text-gray-700 font-semibold text-sm uppercase hover:text-[#dc2626] transition-colors">Contacto</Link>
            </nav>

            {/* Action Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Admin Button */}
              {user?.rol === 'admin' && (
                <Link href="/admin" className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full font-bold text-sm hover:bg-gray-800 transition-colors">
                  <Settings className="w-4 h-4" />
                  Dashboard
                </Link>
              )}

              {/* User Menu */}
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    Hola, <span className="font-bold text-gray-900">{user.nombre.split(' ')[0]}</span>
                  </span>
                  <Link href="/cliente/ordenes" className="flex items-center gap-2 px-4 py-2 border-2 border-[#dc2626] text-[#dc2626] rounded-full font-bold text-sm hover:bg-[#dc2626] hover:text-white transition-colors">
                    <User className="w-4 h-4" />
                    Mi Cuenta
                  </Link>
                  <button onClick={logout} className="text-sm text-gray-500 hover:text-red-500">
                    Salir
                  </button>
                </div>
              ) : (
                <Link href="/cliente/login" className="flex items-center gap-2 px-4 py-2 border-2 border-[#dc2626] text-[#dc2626] rounded-full font-bold text-sm hover:bg-[#dc2626] hover:text-white transition-colors">
                  <User className="w-4 h-4" />
                  Iniciar Sesión
                </Link>
              )}

              {/* Order Now Button */}
              <Link href="/cliente/menu" className="bg-[#dc2626] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#991b1b] transition-colors flex items-center gap-2">
                Ordenar Ahora
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden text-2xl p-2 text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t shadow-lg">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col gap-4">
                <Link href="/" className="text-gray-700 font-semibold text-sm uppercase">Inicio</Link>
                <Link href="/nosotros" className="text-gray-700 font-semibold text-sm uppercase">Nosotros</Link>
                <Link href="/menu" className="text-gray-700 font-semibold text-sm uppercase">Menú</Link>
                <Link href="/contacto" className="text-gray-700 font-semibold text-sm uppercase">Contacto</Link>
                
                <div className="border-t my-2 pt-4">
                  {user?.rol === 'admin' && (
                    <Link href="/admin" className="flex items-center gap-2 text-gray-700 font-semibold text-sm uppercase mb-3">
                      <Settings className="w-4 h-4" />
                      Dashboard Admin
                    </Link>
                  )}
                  
                  {user ? (
                    <>
                      <Link href="/cliente/ordenes" className="text-gray-700 font-semibold text-sm uppercase mb-3 block">
                        Mi Cuenta
                      </Link>
                      <button onClick={logout} className="text-red-500 font-semibold text-sm uppercase">
                        Cerrar Sesión
                      </button>
                    </>
                  ) : (
                    <Link href="/cliente/login" className="text-[#dc2626] font-bold text-sm uppercase">
                      Iniciar Sesión / Registrarse
                    </Link>
                  )}
                </div>

                <Link href="/cliente/menu" className="bg-[#dc2626] text-white px-5 py-3 rounded-full font-bold text-sm text-center mt-2">
                  Ordenar Ahora
                </Link>
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
}