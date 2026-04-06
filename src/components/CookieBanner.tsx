"use client";

import { useCookies } from "./providers/CookieProvider";
import Link from "next/link";
import { X, Cookie } from "lucide-react";

export default function CookieBanner() {
  const { hasInteracted, declineCookies } = useCookies();

  if (hasInteracted) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-in">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-4xl mx-auto p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-14 h-14 bg-[#dc2626]/20 rounded-full flex items-center justify-center">
              <Cookie className="w-8 h-8 text-[#dc2626]" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">
              Uso de Cookies
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 md:mb-0">
              Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestro sitio, 
              analizar el uso que haces de la plataforma y personalizar el contenido. Al continuar navegando, 
              aceptas nuestra{" "}
              <Link href="/privacidad" className="text-[#dc2626] hover:underline">
                Política de Privacidad
              </Link>{" "}
              y{" "}
              <Link href="/cookies" className="text-[#dc2626] hover:underline">
                Política de Cookies
              </Link>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href="/cookies"
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors text-center"
            >
              Más información
            </Link>
            <div className="flex gap-3">
              <button
                onClick={declineCookies}
                className="px-5 py-2.5 text-sm font-medium text-gray-400 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Rechazar
              </button>
              <button
                onClick={() => {
                  localStorage.setItem("krokori_cookie_consent", "accepted");
                  window.location.reload();
                }}
                className="px-5 py-2.5 text-sm font-medium text-white bg-[#dc2626] rounded-lg hover:bg-[#b91c1c] transition-colors"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
