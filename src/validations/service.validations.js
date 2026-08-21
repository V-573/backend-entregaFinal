// src/validations/service.validations.js
import { z } from "zod";

export const createServiceSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  description: z.string().min(5, "La descripción es obligatoria"),
  // z.coerce.number() transforma "30" a 30 automáticamente
  duration: z.coerce.number().positive("La duración debe ser mayor a cero"),
  price: z.coerce.number().min(0, "El precio no puede ser negativo"),
  category: z.string().min(2, "La categoría es obligatoria"),
  available: z.boolean().optional(),
});

export const updateServiceSchema = createServiceSchema.partial();