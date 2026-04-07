"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { SocialIcon } from "./SocialIcon";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* What We Offer */}
          <div>
            <h5 className="text-lg font-bold mb-4 text-[#dc2626]">¿Qué ofrecemos?</h5>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/menu" className="hover:text-[#dc2626]">• Pizzas</Link></li>
              <li><Link href="/menu" className="hover:text-[#dc2626]">• Hamburguesas</Link></li>
              <li><Link href="/menu" className="hover:text-[#dc2626]">• Ensaladas</Link></li>
              <li><Link href="/menu" className="hover:text-[#dc2626]">• Bebidas</Link></li>
              <li><Link href="/menu" className="hover:text-[#dc2626]">• Postres</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h5 className="text-lg font-bold mb-4 text-[#dc2626]">Información</h5>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/nosotros" className="hover:text-[#dc2626]">• Nosotros</Link></li>
              <li><a href="#" className="hover:text-[#dc2626]">• Últimas Noticias</a></li>
              <li><Link href="/menu" className="hover:text-[#dc2626]">• Nuestra Carta</Link></li>
              <li><Link href="/terminos" className="hover:text-[#dc2626]">• Términos y Condiciones</Link></li>
              <li><Link href="/privacidad" className="hover:text-[#dc2626]">• Política de Privacidad</Link></li>
              <li><Link href="/cookies" className="hover:text-[#dc2626]">• Política de Cookies</Link></li>
              <li><Link href="/devoluciones" className="hover:text-[#dc2626]">• Devoluciones</Link></li>
              <li><Link href="/contacto" className="hover:text-[#dc2626]">• Contáctanos</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h5 className="text-lg font-bold mb-4 text-[#dc2626]">Contacto</h5>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#dc2626]" />
                <a href="tel:300-904-7298" className="hover:text-[#dc2626]">300-904-7298</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#dc2626]" />
                <span>Bogotá. Colombia</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#dc2626]" />
                <a href="mailto:info@Krokori.org" className="hover:text-[#dc2626]">info@Krokori.org</a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-lg font-bold mb-4 text-[#dc2626]">Boletín</h5>
            <p className="text-gray-400 mb-4">Regístrese hoy para recibir las últimas noticias y descuentos especiales.</p>
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Ingresa tu Correo" 
                className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#dc2626]"
              />
              <button type="submit" className="bg-[#dc2626] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#c2185b] transition-colors">
                Suscribirse!
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo & Phone */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative" style={{ width: 100, height: 33 }}>
                <Image src="/images/logo-198x662.png" alt="Krokori" fill sizes="100px" className="object-contain" unoptimized />
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#dc2626]" />
                <a href="tel:300-904-7298" className="text-white hover:text-[#dc2626] font-medium">300-904-7298</a>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-[#dc2626] rounded-full flex items-center justify-center hover:bg-[#c2185b] transition-colors">
                <SocialIcon platform="facebook" className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-[#dc2626] rounded-full flex items-center justify-center hover:bg-[#c2185b] transition-colors">
                <SocialIcon platform="twitter" className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-[#dc2626] rounded-full flex items-center justify-center hover:bg-[#c2185b] transition-colors">
                <SocialIcon platform="instagram" className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-[#dc2626] rounded-full flex items-center justify-center hover:bg-[#c2185b] transition-colors">
                <SocialIcon platform="linkedin" className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-8 text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Krokori. Reservados todos los derechos. Diseñado por NovaSoft S.A.S</p>
          </div>
        </div>
      </div>
    </footer>
  );
}