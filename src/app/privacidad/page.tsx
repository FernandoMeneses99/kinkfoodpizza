"use client";

export default function PrivacyPage() {
  return (
    <div className="prose prose-lg max-w-none">
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Responsable del Tratamiento</h2>
        <p className="text-gray-600 mb-4">
          <strong>Krokori</strong>, identificado con NIT 901.234.567-8, con domicilio en Bogotá, Colombia, 
          es el responsable del tratamiento de sus datos personales conforme a la Ley 1581 de 2012 
          y el Decreto 1377 de 2013 de la República de Colombia.
        </p>
        <ul className="list-none mt-4 space-y-2 text-gray-600">
          <li><strong>Correo electrónico:</strong> info@Krokori.org</li>
          <li><strong>Teléfono:</strong> 300-904-7298</li>
          <li><strong>Dirección:</strong> Bogotá, Colombia</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Datos Personales Recopilados</h2>
        <p className="text-gray-600 mb-4">
          Krokori recopila los siguientes datos personales:
        </p>
        <ul className="list-disc pl-6 text-gray-600 space-y-2">
          <li><strong>Datos de identificación:</strong> nombre completo, número de documento de identidad</li>
          <li><strong>Datos de contacto:</strong> correo electrónico, número de teléfono</li>
          <li><strong>Datos de ubicación:</strong> dirección de entrega, barrio, coordenadas de geolocalización (si aplica)</li>
          <li><strong>Datos de pago:</strong> información de tarjetas de crédito/débito procesada por Wompi (nosotros no almacenamos datos financieros)</li>
          <li><strong>Datos de navegación:</strong> dirección IP, tipo de navegador, páginas visitadas, tiempo de permanencia</li>
          <li><strong>Preferencias:</strong> productos favoritos, historial de pedidos</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Finalidades del Tratamiento</h2>
        <p className="text-gray-600 mb-4">
          Sus datos personales serán utilizados para las siguientes finalidades:
        </p>
        <ul className="list-disc pl-6 text-gray-600 space-y-2">
          <li>Gestionar su registro como usuario en el Sitio</li>
          <li>Procesar y gestionar sus pedidos de comida</li>
          <li>Coordinar la entrega a domicilio</li>
          <li>Procesar pagos a través de pasarelas de pago seguras</li>
          <li>Enviar confirmaciones y actualizaciones sobre sus pedidos</li>
          <li>Atender solicitudes, quejas y reclamos</li>
          <li>Enviar comunicaciones comerciales y promocionales (solo si ha dado su consentimiento)</li>
          <li>Mejorar nuestros servicios y la experiencia del usuario</li>
          <li>Cumplir con obligaciones legales y regulatorias</li>
          <li>Realizar análisis estadísticos y estudios de mercado</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Derechos del Titular</h2>
        <p className="text-gray-600 mb-4">
          Como titular de datos personales, usted tiene los siguientes derechos conforme al artículo 8 
          de la Ley 1581 de 2012:
        </p>
        <ul className="list-disc pl-6 text-gray-600 space-y-2">
          <li><strong>Conocer:</strong> Acceder a sus datos personales contenidos en nuestras bases de datos</li>
          <li><strong>Actualizar:</strong> Actualizar o rectificar sus datos personales</li>
          <li><strong>Eliminar:</strong> Solicitar la eliminación de sus datos personales</li>
          <li><strong>Revocar:</strong> Revocar la autorización otorgada para el tratamiento de sus datos</li>
          <li><strong>Solicitar prueba:</strong> Obtener prueba de la autorización otorgada</li>
          <li><strong>Presentar quejas:</strong> Presentar quejas ante la Superintendencia de Industria y Comercio (SIC)</li>
        </ul>
        <p className="text-gray-600 mt-4">
          Para ejercer sus derechos, puede contactarnos a través de los canales indicados en la sección 10.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Principio de Minimización</h2>
        <p className="text-gray-600">
          De acuerdo con el principio de minimización de datos (artículo 4 de la Ley 1581 de 2012), 
          solo recopilamos los datos estrictamente necesarios para cumplir con las finalidades descritas. 
          No solicitamos datos sensibles como origen racial, étnico, orientación política, creencias religiosas, 
          datos biométricos, salud o vida sexual, salvo autorización expresa del titular.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Seguridad de los Datos</h2>
        <p className="text-gray-600 mb-4">
          Krokori implementa medidas técnicas, humanas y administrativas necesarias para garantizar la 
          seguridad de sus datos personales y prevenir su alteración, pérdida, acceso no autorizado o uso indebido.
        </p>
        <p className="text-gray-600">
          Entre las medidas implementadas se encuentran: encriptación de datos sensibles, protocolos de 
          seguridad HTTPS, firewalls, controles de acceso, copias de seguridad periódicas y capacitación 
          del personal en protección de datos.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Transferencia y Compartición de Datos</h2>
        <p className="text-gray-600 mb-4">
          Sus datos personales podrán ser compartidos con:
        </p>
        <ul className="list-disc pl-6 text-gray-600 space-y-2">
          <li><strong>Proveedores de pago:</strong> Wompi y procesadores de pago autorizados para procesar transacciones</li>
          <li><strong>Proveedores de servicios:</strong> Empresas de logística y delivery para la entrega de pedidos</li>
          <li><strong>Autoridades:</strong> Cuando sea requerido por ley, orden judicial o autoridad competente</li>
          <li><strong>Analítica:</strong> Google Analytics y Vercel Analytics para análisis del Sitio</li>
        </ul>
        <p className="text-gray-600 mt-4">
          Los terceros con quienes compartimos sus datos están obligados a mantener la confidencialidad 
          y seguridad de su información, y a utilizarla únicamente para los fines que se les ha autorizado.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Retención de Datos</h2>
        <p className="text-gray-600">
          Sus datos personales serán conservados durante el tiempo necesario para cumplir con las 
          finalidades descritas en esta política. Una vez finalizada la relación contractual, sus datos 
          podrán ser conservados para el cumplimiento de obligaciones legales por un período mínimo de 
          5 años conforme a la normativa colombiana. Los datos de análisis y estadística serán retenidos 
          de forma anonimizada por un máximo de 2 años.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Uso de Cookies</h2>
        <p className="text-gray-600 mb-4">
          El Sitio utiliza cookies y tecnologías similares. Para mayor información sobre el uso de cookies, 
          los tipos de cookies que utilizamos y cómo gestionarlas, consulte nuestra{" "}
          <a href="/cookies" className="text-[#dc2626] hover:underline">Política de Cookies</a>.
        </p>
        <p className="text-gray-600">
          Al navegar por el Sitio, usted acepta el uso de cookies conforme a los términos aquí descritos, 
          a menos que configure su navegador para rechazarlas.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Menores de Edad</h2>
        <p className="text-gray-600">
          El Sitio no está dirigido a menores de edad. Si detectamos que hemos recopilado datos personales 
          de un menor sin la verificación de consentimiento parental, procederemos a eliminar dicha información 
          de nuestros servidores. Los padres o tutores pueden contactarnos si tienen conocimiento del uso no 
          autorizado de datos de menores.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Cambios a la Política</h2>
        <p className="text-gray-600">
          Krokori podrá modificar esta Política de Privacidad en cualquier momento. Los cambios serán 
          publicados en esta página con la fecha de &quot;última actualización&quot; modificada. Se recomienda 
          revisar periódicamente esta política para estar informado sobre cómo protegemos su información.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contacto</h2>
        <p className="text-gray-600 mb-4">
          Para ejercer sus derechos como titular de datos personales, presentar solicitudes, quejas 
          o recibir más información sobre nuestra Política de Privacidad, puede contactarnos:
        </p>
        <ul className="list-none mt-4 space-y-2 text-gray-600">
          <li><strong>Correo electrónico:</strong> info@Krokori.org</li>
          <li><strong>Teléfono:</strong> 300-904-7298</li>
          <li><strong>Dirección:</strong> Bogotá, Colombia</li>
        </ul>
        <p className="text-gray-600 mt-4">
          Respondemos a todas las solicitudes dentro de los plazos establecidos por la ley 
          (10 días hábiles para solicitud de información y 15 días hábiles para quejas).
        </p>
      </section>
    </div>
  );
}
