"use client";

export default function CookiesPage() {
  return (
    <div className="prose prose-lg max-w-none">
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. ¿Qué son las Cookies?</h2>
        <p className="text-gray-600 mb-4">
          Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (computadora, 
          tablet o teléfono móvil) cuando visita un sitio web. Las cookies nos ayudan a reconocer 
          su dispositivo y recordar sus preferencias entre visitas, mejorando así su experiencia de usuario.
        </p>
        <p className="text-gray-600">
          Además de cookies, podemos utilizar tecnologías similares como píxeles de seguimiento, 
          web beacons, archivos de registro del servidor y otras tecnologías de almacenamiento local 
          (como localStorage y sessionStorage), en adelante denominadas colectivamente &quot;cookies&quot;.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Tipos de Cookies que Utilizamos</h2>
        <p className="text-gray-600 mb-4">
          El Sitio de Krokori utiliza los siguientes tipos de cookies:
        </p>

        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">2.1 Cookies Esenciales</h3>
            <p className="text-gray-600 mb-3">
              Estas cookies son necesarias para que el sitio web funcione correctamente. No requieren 
              su consentimiento y se instalan automáticamente.
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>Autenticación:</strong> Permiten identificar usuarios registrados y mantener la sesión activa</li>
              <li><strong>Carrito de compras:</strong> Guardan los productos seleccionados durante la compra</li>
              <li><strong>Seguridad:</strong> Ayudan a prevenir fraudes y proteger la seguridad del sitio</li>
              <li><strong>Consentimiento:</strong> Recuerdan sus preferencias sobre el uso de cookies</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">2.2 Cookies de Funcionalidad</h3>
            <p className="text-gray-600 mb-3">
              Estas cookies recuerdan sus preferencias y configuraciones para mejorar su experiencia.
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>Idioma preferido:</strong> Recuerdan el idioma de navegación seleccionado</li>
              <li><strong>Dirección guardada:</strong> Almacenan direcciones de entrega frecuentes</li>
              <li><strong>Preferencias visuales:</strong> Recuerdan el tamaño de texto u otras preferencias</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">2.3 Cookies Analíticas</h3>
            <p className="text-gray-600 mb-3">
              Nos ayudan a comprender cómo los visitantes interactúan con nuestro sitio web mediante 
              información anónima y agregada.
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>Google Analytics:</strong> Recopila datos sobre visitas, páginas vistas, tiempo en el sitio</li>
              <li><strong>Vercel Analytics:</strong> Proporciona métricas de rendimiento y uso del sitio</li>
            </ul>
            <p className="text-gray-600 mt-3 text-sm italic">
              Nota: Estas cookies utilizan información anonimizada y no permiten identificarle personalmente.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">2.4 Cookies de Marketing</h3>
            <p className="text-gray-600 mb-3">
              Se utilizan para mostrarle anuncios relevantes según sus intereses. Estas cookies solo se 
              instalarán si usted acepta su uso.
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>Redes sociales:</strong> Permiten compartir contenido en redes sociales</li>
              <li><strong>Píxeles de seguimiento:</strong> Ayudan a medir la efectividad de nuestras campañas</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cookies de Terceros</h2>
        <p className="text-gray-600 mb-4">
          Algunos cookies en nuestro sitio son establecidos por servicios de terceros:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Proveedor</th>
                <th className="border p-3 text-left">Tipo</th>
                <th className="border p-3 text-left">Finalidad</th>
                <th className="border p-3 text-left">Duración</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              <tr>
                <td className="border p-3">Google Analytics</td>
                <td className="border p-3">Analítica</td>
                <td className="border p-3">Análisis de tráfico web</td>
                <td className="border p-3">2 años</td>
              </tr>
              <tr>
                <td className="border p-3">Vercel</td>
                <td className="border p-3">Analítica</td>
                <td className="border p-3">Métricas de rendimiento</td>
                <td className="border p-3">Sesión</td>
              </tr>
              <tr>
                <td className="border p-3">Wompi</td>
                <td className="border p-3">Pago</td>
                <td className="border p-3">Procesamiento de pagos seguros</td>
                <td className="border p-3">Sesión</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Base Legal para el Uso de Cookies</h2>
        <p className="text-gray-600 mb-4">
          El uso de cookies se fundamenta en:
        </p>
        <ul className="list-disc pl-6 text-gray-600 space-y-2">
          <li><strong>Cookies esenciales:</strong> Interesse legítimo y ejecución del contrato de servicios</li>
          <li><strong>Cookies de funcionalidad:</strong> Su consentimiento explícito</li>
          <li><strong>Cookies analíticas:</strong> Su consentimiento explícito</li>
          <li><strong>Cookies de marketing:</strong> Su consentimiento explícito</li>
        </ul>
        <p className="text-gray-600 mt-4">
          Al visitar nuestro sitio por primera vez, se mostrará un banner de cookies solicitándole 
          que acepte o rechace las cookies no esenciales. Puede cambiar sus preferencias en cualquier 
          momento a través de nuestra configuración de cookies.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cómo Gestionar las Cookies</h2>
        <p className="text-gray-600 mb-4">
          Usted tiene varias opciones para gestionar el uso de cookies:
        </p>

        <div className="space-y-4">
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">5.1 Banner de Cookies</h3>
            <p className="text-gray-600">
              Al visitar nuestro sitio, puede aceptar o rechazar las cookies no esenciales a través 
              del banner de cookies. Sus preferencias se almacenarán y no se le volverá a mostrar el 
              banner excepto si borra las cookies del sitio de su navegador.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">5.2 Configuración del Navegador</h3>
            <p className="text-gray-600 mb-3">
              Puede configurar su navegador para:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Ser notificado cuando se intenten instalar cookies</li>
              <li>Bloquear todas las cookies</li>
              <li>Bloquear cookies de sitios específicos</li>
              <li>Eliminar cookies existentes</li>
              <li>Aceptar solo cookies de sitios web confiables</li>
            </ul>
            <p className="text-gray-600 mt-3">
              Los principales navegadores permiten esta configuración en:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mt-2 space-y-1">
              <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</li>
              <li><strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies</li>
              <li><strong>Safari:</strong> Preferencias → Privacidad → Cookies</li>
              <li><strong>Edge:</strong> Configuración → Cookies y permisos del sitio</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">5.3 Opt-out de Analítica</h3>
            <p className="text-gray-600">
              Puede optar por no participar en la analítica de Google Analytics instalando el 
              <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-[#dc2626] hover:underline mx-1">
                complemento de exclusión de Google Analytics
              </a>
              en su navegador.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Consecuencias de Rechazar Cookies</h2>
        <p className="text-gray-600">
          Si rechaza las cookies no esenciales, estas no se instalarán en su dispositivo. Sin embargo, 
          algunas funciones del sitio pueden verse limitadas o no estar disponibles, como:
        </p>
        <ul className="list-disc pl-6 text-gray-600 mt-3 space-y-1">
          <li>Recordar sus preferencias de navegación</li>
          <li>Mostrar contenido personalizado</li>
          <li>Analíticas de uso del sitio</li>
        </ul>
        <p className="text-gray-600 mt-3">
          Las cookies esenciales siempre estarán activas ya que son necesarias para el funcionamiento 
          básico del sitio.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Actualizaciones de esta Política</h2>
        <p className="text-gray-600">
          Podemos actualizar esta Política de Cookies periódicamente para reflejar cambios en los 
          servicios, tecnologías o requisitos legales. Cualquier cambio será publicado en esta página 
          con la fecha de &quot;última actualización&quot; modificada.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Transferencia Internacional de Datos</h2>
        <p className="text-gray-600">
          Some of our third-party service providers may be located outside of Colombia or may store 
          information in servers located in other countries. When we transfer your data internationally, 
          we ensure appropriate safeguards are in place, such as standard contractual clauses approved 
          by the competent authority.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contacto</h2>
        <p className="text-gray-600 mb-4">
          Si tiene preguntas sobre nuestro uso de cookies o esta política, puede contactarnos:
        </p>
        <ul className="list-none mt-4 space-y-2 text-gray-600">
          <li><strong>Correo electrónico:</strong> info@Krokori.org</li>
          <li><strong>Teléfono:</strong> 300-904-7298</li>
          <li><strong>Dirección:</strong> Bogotá, Colombia</li>
        </ul>
      </section>
    </div>
  );
}
