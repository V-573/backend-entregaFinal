// export const validateSchema = (schema) => (req, res, next) => {
//   try {
//     // parse() valida los datos. Si fallan, lanza un error ZodError.
//     // También sobrescribe req.body con los datos limpios/transformados por Zod.
//     req.body = schema.parse(req.body);
//     next(); // Si la validación pasa, continua al controlador
//   } catch (error) {
//     // Si la validación pasa, continua al controlador
//     return res.status(400).json({
//       success: false,
//       message: "Error de validación de datos",
//       errors: error.errors.map((e) => ({
//         field: e.path.join("."),
//         message: e.message,
//       })),
//     });
//   }
// };


// src/middlewares/validate.middleware.js

export const validateSchema  = (schema) => (req, res, next) => {
  // 1. Aseguramos que req.body no sea undefined
  const dataToValidate = req.body || {};

  const result = schema.safeParse(dataToValidate);

  if (!result.success) {
    // 2. Usamos (result.error.issues || result.error.errors) para evitar el TypeError
    const issues = result.error.issues || result.error.errors || [];

    const formattedErrors = issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message
    }));

    // 3. Devolvemos el JSON de error de validación
    return res.status(400).json({
      success: false,
      message: 'Error de validación en los datos enviados',
      errors: formattedErrors
    });
  }

  // Si todo está correcto, asignamos el resultado parseado y continuamos
  req.body = result.data;
  next();
};