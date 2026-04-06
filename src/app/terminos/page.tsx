"use client";

export default function TermsPage() {
  return (
    <div className="prose prose-lg max-w-none">
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Información General</h2>
        <p className="text-gray-600 mb-4">
          Los presentes Términos y Condiciones regulan el uso del sitio web Krokori (en adelante, "el Sitio") 
          y los servicios de comida a domicilio ofrecidos por Krokori, identificado con NIT 901.234.567-8, 
          con domicilio en Bogotá, Colombia.
        </p>
        <p className="text-gray-600">
          Al acceder, navegar o utilizar el Sitio, el usuario acepta expresamente someterse a los presentes 
          Términos y Condiciones en la versión publicada en el momento de acceso.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Servicios Ofrecidos</h2>
        <p className="text-gray-600 mb-4">
          Krokori ofrece los siguientes servicios a través del Sitio:
        </p>
        <ul className="list-disc pl-6 text-gray-600 space-y-2">
          <li>Venta de productos alimenticios (pizzas, hamburguesas, pastas, ensaladas, bebidas y postres)</li>
          <li>Servicio de domicilio en Bogotá y áreas metropolitanas</li>
          <li>Suscripción al boletín promocional</li>
          <li>Gestión de pedidos en línea</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Registro y Cuenta de Usuario</h2>
        <p className="text-gray-600 mb-4">
          Para realizar pedidos a través del Sitio, el usuario debe:
        </p>
        <ul className="list-disc pl-6 text-gray-600 space-y-2">
          <li>Ser mayor de edad (18 años) o contar con autorización de representante legal</li>
          <li>Proporcionar información veraz, exacta y completa</li>
          <li>Mantener la confidencialidad de sus credenciales de acceso</li>
          <li>Notificar inmediatamente cualquier uso no autorizado de su cuenta</li>
        </ul>
        <p className="text-gray-600 mt-4">
          El usuario es responsable de todas las actividades realizadas con su cuenta.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Proceso de Pedido y Contratación</h2>
        <p className="text-gray-600 mb-4">
          El proceso de contratación de servicios será el siguiente:
        </p>
        <ol className="list-decimal pl-6 text-gray-600 space-y-2">
          <li>Seleección de productos y adición al carrito de compras</li>
          <li>Revisión del pedido y cálculo de costos (incluyendo domicilio)</li>
          <li>Ingreso de datos de entrega y contacto</li>
          <li>Selección del método de pago</li>
          <li>Confirmación del pedido mediante botón de pago/confirmación</li>
          <li>Recibir confirmación por correo electrónico</li>
        </ol>
        <p className="text-gray-600 mt-4">
          Krokori se reserva el derecho de rechazar o cancelar pedidos en caso de detectarse fraude, 
          errores en la información proporcionada o indisponibilidad del producto.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Precios y Formas de Pago</h2>
        <p className="text-gray-600 mb-4">
          Los precios de los productos están expresados en pesos colombianos (COP) e incluyen el IVA 
          cuando aplique. El costo de domicilio es de $5.000 COP para pedidos menores a $70.000 COP; 
          para pedidos iguales o superiores a $70.000 COP, el domicilio es gratuito.
        </p>
        <p className="text-gray-600 mb-4">
          Formas de pago aceptadas:
        </p>
        <ul className="list-disc pl-6 text-gray-600 space-y-2">
          <li>Tarjetas de crédito y débito (Visa, Mastercard, American Express)</li>
          <li>PSE - Pago bancario en línea</li>
          <li>Nequi y Daviplata</li>
          <li>Efectivo contra entrega</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Delivery y Tiempos de Entrega</h2>
        <p className="text-gray-600 mb-4">
          El tiempo estimado de preparación y entrega varía entre 30 y 60 minutos dependiendo de la 
          ubicación del cliente y la demanda del momento. Krokori realizará sus mejores esfuerzos 
          por cumplir con los tiempos estimados, pero estos pueden variar por circunstancias externas.
        </p>
        <p className="text-gray-600">
          Es responsabilidad del cliente proporcionar una dirección de entrega precisa y completa. 
          Krokori no se responsabiliza por retrasos causados por información incorrecta.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cancelaciones</h2>
        <p className="text-gray-600 mb-4">
          El usuario podrá cancelar su pedido sin costo adicional únicamente cuando el estado del pedido 
          sea &quot;pendiente&quot; o &quot;confirmado&quot;. Una vez el pedido pase al estado &quot;preparando&quot;, 
          no será posible realizar la cancelación.
        </p>
        <p className="text-gray-600">
          En caso de cancelación tardía o falta de respuesta en la dirección de entrega después de 
          3 intentos de contacto, el pedido será cancelado y se podrán aplicar cargos según la política 
          de devoluciones.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Propiedad Intelectual</h2>
        <p className="text-gray-600">
          Todo el contenido del Sitio, incluyendo pero no limitándose a textos, gráficos, logotipos, 
          imágenes, diseño, software y código, está protegido por derechos de autor y propiedad intelectual 
          de Krokori o sus licenciantes. Queda prohibida la reproducción, distribución o modificación 
          sin autorización expresa.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitación de Responsabilidad</h2>
        <p className="text-gray-600">
          Krokori no será responsable por daños indirectos, incidentales, especiales o consecuentes 
          que surjan del uso del Sitio o de los servicios ofrecidos. La responsabilidad total de Krokori 
          no excederá en ningún caso el monto total pagado por el usuario en su último pedido.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Modificaciones</h2>
        <p className="text-gray-600">
          Krokori se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. 
          Los cambios entrarán en vigor desde su publicación en el Sitio. Es responsabilidad del usuario 
          revisar periódicamente los Términos vigentes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Ley Aplicable y Jurisdicción</h2>
        <p className="text-gray-600">
          Estos Términos se rigen por las leyes de la República de Colombia. Cualquier controversia 
          derivada de la interpretación o ejecución de los presentes Términos será sometida a los 
          tribunales competentes de Bogotá, Colombia.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contacto</h2>
        <p className="text-gray-600">
          Para cualquier consulta relacionada con estos Términos y Condiciones, puede contactarnos a través de:
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
