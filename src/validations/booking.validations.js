// src/validations/booking.validations.js
import { z } from 'zod';

export const createBookingSchema = z.object({
  // Nombre obligatorio
  clientName: z
    .string({ required_error: 'El nombre del cliente es obligatorio' })
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .trim(),

  // Email obligatorio con formato de correo
  clientEmail: z
    .string({ required_error: 'El email del cliente es obligatorio' })
    .email('El formato del email no es válido')
    .trim()
    .toLowerCase(),

  // Fecha obligatoria (Acepta 'YYYY-MM-DD' o formato ISO)
  date: z
    .string({ required_error: 'La fecha es obligatoria' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener el formato YYYY-MM-DD'),

  // Hora obligatoria (Formato 24 horas 'HH:MM', ej: '14:30' o '09:00')
  time: z
    .string({ required_error: 'La hora es obligatoria' })
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'La hora debe tener un formato válido de 24h (HH:MM)'),

  // Estado opcional (Si no se envía, por defecto será 'pending')
  status: z
    .enum(['pending', 'confirmed', 'completed', 'cancelled'], {
      errorMap: () => ({ message: 'El estado enviado no es válido' })
    })
    .optional()
    .default('pending'),

  // Lista de servicios opcional como Array de cadenas o IDs
  services: z
    .array(
      z.string({ invalid_type_error: 'Cada servicio debe ser un texto o ID válido' }),
      { invalid_type_error: 'Los servicios deben enviarse dentro de un arreglo (array)' }
    )
    .optional()
    .default([])
});

// Esquema de actualización (todos los campos se vuelven opcionales)
export const updateBookingSchema = createBookingSchema.partial();