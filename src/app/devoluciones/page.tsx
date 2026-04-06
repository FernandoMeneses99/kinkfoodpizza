"use client";

export default function ReturnsPage() {
  return (
    <div className="prose prose-lg max-w-none">
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Información General</h2>
        <p className="text-gray-600 mb-4">
          En Krokori nos esforzamos por ofrecer productos de la más alta calidad. Entendemos que, 
          en ocasiones, pueden surgir situaciones que requieran atención especial. Esta política 
          establece los términos y condiciones para devoluciones, reembolsos y cancelaciones.
        </p>
        <p className="text-gray-600">
          Nuestra política se fundamenta en la normativa colombiana de protección al consumidor, 
          particularmente la Ley 1480 de 2011 (Estatuto del Consumidor) y sus decrees reglamentarios.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Condiciones para Devoluciones</h2>
        <p className="text-gray-600 mb-4">
          Dada la naturaleza de nuestros productos (alimentos preparados para consumo inmediato), 
          nuestras condiciones de devolución son las siguientes:
        </p>

        <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl mb-6">
          <h3 className="text-lg font-semibold text-green-800 mb-3">Casos en que aceptamos devoluciones</h3>
          <ul className="list-disc pl-6 text-green-700 space-y-2">
            <li>
              <strong>Error en el pedido:</strong> El producto recibido no corresponde con lo solicitado 
              (diferente sabor, cantidad incorrecta, ingredientes equivocados)
            </li>
            <li>
              <strong>Producto en mal estado:</strong> El alimento llega en condiciones que no son aptas 
              para el consumo (frozens, derramado, contaminado)
            </li>
            <li>
              <strong>Incumplimiento del tiempo máximo:</strong> La entrega supera los 90 minutos sin 
              justificación válida por parte de Krokori
            </li>
            <li>
              <strong>Alergenos no declarados:</strong> El producto contiene ingredientes no declarados 
              que causen reacción alérgica
            </li>
          </ul>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
          <h3 className="text-lg font-semibold text-red-800 mb-3">Casos NO aplicables para devolución</h3>
          <ul className="list-disc pl-6 text-red-700 space-y-2">
            <li>Cambio de opinión del cliente después de recibir el pedido</li>
            <li>El cliente no se encuentra en la dirección al momento de la entrega</li>
            <li>El cliente proporcionó una dirección incorrecta o incompleta</li>
            <li>El cliente rechazó el pedido sin causa justificada</li>
            <li>Alimentos que han sido consumidos parcialmente o modificados</li>
            <li>Solicitudes posteriores a 2 horas de la entrega</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Proceso para Solicitar una Devolución</h2>
        <p className="text-gray-600 mb-4">
          Para solicitar una devolución o compensación, siga estos pasos:
        </p>
        <ol className="list-decimal pl-6 text-gray-600 space-y-4">
          <li className="pl-2">
            <strong>Contacte inmediatamente:</strong> Notifique a Krokori dentro de los primeros 
            30 minutos después de recibir su pedido si detecta algún problema.
          </li>
          <li className="pl-2">
            <strong>Proporcione evidencia:</strong> Envíe fotografías claras del producto recibido, 
            el empaque y la etiqueta del pedido si es posible.
          </li>
          <li className="pl-2">
            <strong>Describa el problema:</strong> Explique detalladamente qué está mal con el pedido 
            para que podamos evaluar la situación.
          </li>
          <li className="pl-2">
            <strong>Espere validación:</strong> Nuestro equipo evaluará su caso y le responderá en 
            un máximo de 24 horas hábiles.
          </li>
          <li className="pl-2">
            <strong>Reciba su compensación:</strong> Una vez aprobado, recibirá un código de descuento 
            o se realizará el reembolso según corresponda.
          </li>
        </ol>
        <p className="text-gray-600 mt-4">
          <strong>Canales de contacto:</strong>
        </p>
        <ul className="list-none mt-2 space-y-2 text-gray-600">
          <li>WhatsApp: 300-904-7298 (preferido para devoluciones)</li>
          <li>Correo electrónico: info@Krokori.org</li>
          <li>Teléfono: 300-904-7298</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Opciones de Compensación</h2>
        <p className="text-gray-600 mb-4">
          Ante una solicitud de devolución validada, Krokori ofrece las siguientes opciones de compensación:
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Cupón de Descuento</h3>
            <p className="text-gray-600">
              Recibir un cupón equivalente al 100% del valor del producto afectado, válido por 30 días 
              para su próximo pedido.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Reposición del Producto</h3>
            <p className="text-gray-600">
              Envío de un nuevo producto idéntico al afectado sin costo adicional. El producto 
              defectuoso no requiere ser devuelto.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Reembolso Económico</h3>
            <p className="text-gray-600">
              Reembolso del valor del producto afectado al método de pago original. El tiempo de 
              reembolso varía según el método de pago (3-15 días hábiles).
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Crédito a Favor</h3>
            <p className="text-gray-600">
              Abono del valor a su cuenta de cliente Krokori, disponible inmediatamente para 
              su próximo pedido.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cancelación de Pedidos</h2>
        <p className="text-gray-600 mb-4">
          Usted puede cancelar su pedido según las siguientes condiciones:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Estado del Pedido</th>
                <th className="border p-3 text-left">¿Se puede cancelar?</th>
                <th className="border p-3 text-left">Reembolso</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              <tr>
                <td className="border p-3 font-medium">Pendiente</td>
                <td className="border p-3 text-green-600">Sí, sin costo</td>
                <td className="border p-3">Inmediato (1-3 días hábiles)</td>
              </tr>
              <tr>
                <td className="border p-3 font-medium">Confirmado</td>
                <td className="border p-3 text-green-600">Sí, sin costo</td>
                <td className="border p-3">Inmediato (1-3 días hábiles)</td>
              </tr>
              <tr>
                <td className="border p-3 font-medium">Preparando</td>
                <td className="border p-3 text-yellow-600">Parcialmente</td>
                <td className="border p-3">Valor parcial menos costos incurridos</td>
              </tr>
              <tr>
                <td className="border p-3 font-medium">En camino</td>
                <td className="border p-3 text-red-600">No</td>
                <td className="border p-3">Cupón de descuento (50%)</td>
              </tr>
              <tr>
                <td className="border p-3 font-medium">Entregado</td>
                <td className="border p-3 text-red-600">No</td>
                <td className="border p-3">Consulte Política de Devoluciones</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Reembolsos</h2>
        <p className="text-gray-600 mb-4">
          Los reembolsos se procesarán de la siguiente manera:
        </p>
        <ul className="list-disc pl-6 text-gray-600 space-y-2">
          <li>
            <strong>Pagos con tarjeta:</strong> El reembolso se procesará al método de pago original. 
            El tiempo de acreditación depende de su entidad bancaria (3-15 días hábiles).
          </li>
          <li>
            <strong>Pagos con Nequi/Daviplata:</strong> Reembolso inmediato a la misma billetera digital.
          </li>
          <li>
            <strong>Pago en efectivo:</strong> Reembolso mediante transferencia bancaria ocupación 
            válida dentro de los 5 días hábiles.
          </li>
          <li>
            <strong>Pagos con cupones:</strong> No son reembolsables en efectivo; se emite nuevo cupón.
          </li>
        </ul>
        <p className="text-gray-600 mt-4">
          Los reembolsos将通过您选择的原始付款方式处理.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Garantía de Productos</h2>
        <p className="text-gray-600 mb-4">
          Nuestros productos están cubiertos por la garantía legal de calidad según el artículo 11 
          de la Ley 1480 de 2011:
        </p>
        <ul className="list-disc pl-6 text-gray-600 space-y-2">
          <li>
            <strong>Productos defectuosos:</strong> Recht auf Reparatur, Ersatz oder Rückerstattung 
            innerhalb von 30 Tagen nach Lieferung.
          </li>
          <li>
            <strong>Calidad inadecuada:</strong> Wenn das Produkt nicht den beschriebenen 
            Eigenschaften entspricht, haben Sie Anspruch auf Entschädigung.
          </li>
          <li>
            <strong>Vencimiento:</strong>Productos que lleguen vencidos o con fecha de caducidad 
            próxima a su consumo serán reemplazados inmediatamente.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Exoneración de Responsabilidad</h2>
        <p className="text-gray-600">
          Krokori no se hace responsable por:
        </p>
        <ul className="list-disc pl-6 text-gray-600 mt-3 space-y-2">
          <li>Demoras causadas por dirección incorrecta proporcionada por el cliente</li>
          <li>Condiciones climáticas extremas o situaciones de fuerza mayor</li>
          <li>Fallas en la red de telecomunicaciones o sistemas de pago</li>
          <li>Productos consumidos o modificados después de la entrega</li>
          <li>Rechazos de entrega por parte del cliente sin causa justificada</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cambios a esta Política</h2>
        <p className="text-gray-600 mb-4">
          Krokori se reserva el derecho de modificar esta política en cualquier momento. Los cambios 
          serán efectivos desde su publicación en el Sitio.
        </p>
        <p className="text-gray-600">
          <strong>Contacto para devoluciones:</strong>
        </p>
        <ul className="list-none mt-4 space-y-2 text-gray-600">
          <li><strong>WhatsApp:</strong> 300-904-7298</li>
          <li><strong>Correo electrónico:</strong> info@Krokori.org</li>
          <li><strong>Teléfono:</strong> 300-904-7298</li>
          <li><strong>Horario de atención:</strong> Lunes a Domingo, 11:00 AM - 10:00 PM</li>
        </ul>
      </section>
    </div>
  );
}
