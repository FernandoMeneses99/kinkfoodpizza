import Joi from 'joi';

export const registerSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().max(255).required(),
  telefono: Joi.string().pattern(/^[0-9]{7,15}$/).required(),
  password: Joi.string().min(6).max(100).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const productoSchema = Joi.object({
  categoria_id: Joi.number().integer().positive().required(),
  nombre: Joi.string().min(2).max(150).required(),
  descripcion: Joi.string().max(1000).allow('', null),
  precio: Joi.number().positive().precision(2).required(),
  precio_oferta: Joi.number().positive().precision(2).allow(null),
  ingredientes: Joi.string().max(500).allow('', null),
  tiempo_preparacion: Joi.number().integer().positive().default(15),
  disponible: Joi.boolean().default(true),
  destacado: Joi.boolean().default(false),
  stock: Joi.number().integer().min(0).default(100),
});

export const categoriaSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required(),
  descripcion: Joi.string().max(500).allow('', null),
  icono: Joi.string().max(50).allow('', null),
  orden: Joi.number().integer().min(0).default(0),
  activo: Joi.boolean().default(true),
});

export const ordenSchema = Joi.object({
  direccion_entrega: Joi.string().min(10).max(500).required(),
  barrio: Joi.string().max(100).allow('', null),
  referencia_direccion: Joi.string().max(500).allow('', null),
  metodo_pago: Joi.string().valid('wompi', 'nequi', 'daviplata', 'contra_entrega').required(),
  notas: Joi.string().max(500).allow('', null),
});

export const direccionSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required(),
  direccion: Joi.string().min(10).max(500).required(),
  barrio: Joi.string().max(100).allow('', null),
  referencia: Joi.string().max(500).allow('', null),
  latitud: Joi.number().min(-90).max(90).allow(null),
  longitud: Joi.number().min(-180).max(180).allow(null),
  es_predeterminada: Joi.boolean().default(false),
});

export const configSchema = Joi.object({
  clave: Joi.string().min(1).max(100).required(),
  valor: Joi.string().allow('', null),
  grupo: Joi.string().valid('general', 'horarios', 'pagos', 'social', 'seo').default('general'),
});

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function validateImage(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Solo se permiten imágenes JPG, PNG, WEBP o GIF' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'La imagen debe ser menor a 5MB' };
  }

  return { valid: true };
}
