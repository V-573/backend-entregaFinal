import { Router } from "express";
import {
  createService,
  deleteService,
  getServices,
  getServiceById,
  updateService,
} from "../controllers/services.controller.js";

// 1. Importas tus esquemas
import {createServiceSchema,
  updateServiceSchema
} from "../validations/service.validations.js"

// 2. Importas el middleware ejecutor
import { validateSchema } from "../middlewares/validate.meddleware.js";

const router = Router();

// El prefijo "/services" se manejará desde el enrutador principal (index.js)
router.get("/", getServices);
router.get("/:id", getServiceById);
router.post("/", validateSchema(createServiceSchema), createService);
router.put("/:id", validateSchema(updateServiceSchema), updateService);
router.delete("/:id", deleteService);

export default router;
