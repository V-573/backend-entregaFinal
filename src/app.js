import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./config/env.config.js";
import mainRouter from "./routers/index.js";
import viewsRouter from "./routers/views.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// 1. Definir ambas rutas (la absoluta interna src/views 
const viewsPathSrc = path.resolve(__dirname, "views");

// 🔹 Habilitar carpeta estática
app.use(express.static(path.resolve(__dirname, "public")));

// 2. Express buscará en src/views 
app.set("views", viewsPathSrc);

// 3. Configurar el motor Handlebars indicando explícitamente la carpeta de views
app.engine(
  "handlebars",
  engine({
    extname: ".handlebars",
    defaultLayout: "main",
    layoutsDir: path.resolve(viewsPathSrc, "layouts"),
  }),
);

app.set("view engine", "handlebars");

console.log("=== RUTA REAL DE VISTAS REGISTRADA EN APP.JS ===");
console.log(app.get("views"));

// Rutas
app.use("/api", mainRouter);
app.use("/", viewsRouter);

export default app;
