import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

async function sendWhatsAppNotification(nombre: string, email: string, mensaje: string) {
  const whatsappNumber = process.env.WHATSAPP_ADMIN || '3009047298';
  const text = `🔔 *Nuevo mensaje de contacto*

👤 *Nombre:* ${nombre}
📧 *Email:* ${email}
💬 *Mensaje:* ${mensaje.substring(0, 200)}${mensaje.length > 200 ? '...' : ''}

*Krokori*`;

  try {
    await fetch(`https://wa.me/57${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, {
      method: 'HEAD'
    });
  } catch (error) {
    console.error('Error enviando notificación WhatsApp:', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name: nombre, email, service: servicio, message: mensaje } = body;

    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { error: 'Nombre, email y mensaje son requeridos' },
        { status: 400 }
      );
    }

    const result = await query<ResultSetHeader>(
      `INSERT INTO contactos (nombre, email, servicio, mensaje, leido, created_at) 
       VALUES (?, ?, ?, ?, 0, NOW())`,
      [nombre, email, servicio || '', mensaje]
    );

    if (result.insertId) {
      sendWhatsAppNotification(nombre, email, mensaje);

      return NextResponse.json({
        success: true,
        message: 'Mensaje guardado correctamente',
        id: result.insertId
      });
    }

    return NextResponse.json(
      { error: 'Error al guardar el mensaje' },
      { status: 500 }
    );

  } catch (error) {
    console.error('Error al guardar contacto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
