
# Backend API - Sistema de Gestión de Servicios y Reservas - tarea final para curso de Backend 2

Este repositorio contiene la API Backend desarrollada en Node.js y Express para la gestión integral de un catálogo de servicios, reservas de clientes, mensajería en tiempo real y vistas dinámicas renderizadas desde el servidor.

---

## 📋 ¿Qué hace el sistema?

El sistema proporciona una arquitectura backend modular construida sobre el patrón MVC/Capas para la administración de:

* **Servicios (`/api/services`)**: Permite listar, consultar por ID, crear, actualizar y eliminar servicios ofertados. Incluye validación estricta de datos de entrada mediante esquemas de Zod.
* **Reservas (`/api/bookings`)**: Permite la creación y gestión de reservas, así como la adición, actualización de cantidades y remoción interactiva de servicios dentro de una reserva específica.
* **Mensajería (`/api/messages`)**: API para la captura y consulta de mensajes de contacto o chat.
* **Vistas Renderizadas (`/views` / Vistas en Server-Side Rendering)**: Renderizado de plantillas de interfaz visual en tiempo real para visualizar catálogo de servicios, detalles y gestión interactiva.
* **WebSockets / Tiempo Real**: Integración de Socket.IO para actualizar vistas e interfaces de manera reactiva ante eventos de adición/modificación.

---

## 🛠️ Tecnologías utilizadas

* **Entorno de ejecución**: Node.js (ES Modules - `import/export`)
* **Framework Web**: Express.js v5
* **Base de Datos**: MongoDB (a través de Mongoose v9)
* **Motor de Plantillas**: Express Handlebars v9
* **WebSockets**: Socket.IO v4 (comunicación bidireccional en tiempo real)
* **Validación de Datos**: Zod v4 (validación de esquemas e inputs)
* **Variables de Entorno**: Dotenv
* **Herramientas de desarrollo**: Node.js Native Watch Mode (`node --watch`)

---

## ⚙️ Variables de entorno

Antes de ejecutar la aplicación, debes crear un archivo `.env` en la raíz de tu proyecto basándote en la siguiente configuración:

```env
PORT=8080
NODE_ENV=development
MONGO_URI=mongodb+srv://tu_usuario:tu_contraseña@clusterpoyectoreservas.cy3w0ry.mongodb.net/reservas_db


## Instalación de dependencias ##
Clonar el repositorio:
git clone https://github.com/V-573/backend-entregaFinal
cd backend-entregafinal

Instalar los paquetes del proyecto:
npm install

Ejecución del proyecto
Modo de desarrollo (con recarga automática mediante el modo nativo watch):
npm run dev

Modo de producción:
npm start

la aplicación estará escuchando en http://localhost:8080

##  Enrutamiento y Endpoints de la API ##

### 🛠️ Servicios (`/services`) ### 

| Método | Ruta | Middleware / Validación | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Ninguno | Obtener la lista completa de servicios |
| `GET` | `/:id` | Ninguno | Obtener un servicio específico por su ID |
| `POST` | `/` | `validateSchema(createServiceSchema)` | Crear un nuevo servicio |
| `PUT` | `/:id` | `validateSchema(updateServiceSchema)` | Actualizar un servicio existente por ID |
| `DELETE` | `/:id` | Ninguno | Eliminar un servicio por ID |

---

### 📅 Reservas (`/bookings`) ###

| Método | Ruta | Middleware / Validación | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | `validateSchema(createBookingSchema)` | Crear una nueva reserva |
| `GET` | `/` | Ninguno | Obtener todas las reservas |
| `GET` | `/:bid` | Ninguno | Obtener detalles de una reserva por su ID (`bid`) |
| `POST` | `/:bid/services/:sid` | Ninguno | Agregar un servicio (`sid`) a la reserva (`bid`) |
| `PATCH` | `/:bid/services/:sid` | Ninguno | Actualizar la cantidad de un servicio en la reserva |
| `DELETE` | `/:bid/services/:sid` | Ninguno | Eliminar un servicio específico de una reserva |
| `DELETE` | `/:bid` | Ninguno | Eliminar una reserva completa por ID |

---

### 💬 Mensajería (`/messages`) ### 

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/` | Obtener el historial de mensajes |
| `POST` | `/` | Guardar un nuevo mensaje |

---

### 🖥️ Vistas Renderizadas Handlebars (`/views` o Raíz) ###

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/` | Redirecciona automáticamente a `/services` |
| `GET` | `/services` | Muestra el catálogo principal de servicios |
| `GET` | `/services/:sid` | Renderiza los detalles de un servicio específico |
| `GET` | `/realtime-services` | Vista interactiva con actualización en tiempo real vía WebSockets |
| `GET` | `/bookings` | Muestra el listado general de reservas |
| `GET` | `/bookings/:id` | Renderiza el detalle completo de una reserva |
| `GET` | `/realtime-bookings` | Vista en tiempo real para monitoreo de reservas |



## 🛡️ Esquemas de Validación y Tipos de Datos (Zod) ##

El sistema utiliza **Zod** para la validación estricta de los datos entrantes en el cuerpo (*body*) de las peticiones HTTP. A continuación se detallan las reglas y restricciones para cada recurso:

---

### 📅 Validación de Reservas (`Bookings`) ###

#### `createBookingSchema` (Creación de Reserva) ####

| Campo | Tipo de Dato | Requerido | Restricciones / Formato | Valor por Defecto |
| :--- | :--- | :---: | :--- | :--- |
| `clientName` | `String` | Sí | Mínimo 2 caracteres (se aplican `trim`) | N/A |
| `clientEmail` | `String` | Sí | Formato válido de email (se aplican `trim` y `toLowerCase`) | N/A |
| `date` | `String` | Sí | Formato de fecha estricto `YYYY-MM-DD` (ej. `2026-08-25`) | N/A |
| `time` | `String` | Sí | Formato de 24 horas `HH:MM` (ej. `09:00` o `14:30`) | N/A |
| `status` | `Enum` | No | Solo acepta: `'pending'`, `'confirmed'`, `'completed'`, `'cancelled'` | `'pending'` |
| `services` | `Array<String>` | No | Lista de IDs o textos representativos de servicios | `[]` |

#### `updateBookingSchema` (Actualización de Reserva) ####
* **Formato**: Todos los campos definidos en `createBookingSchema` pasan a ser opcionales (`.partial()`), permitiendo actualizar únicamente los campos enviados en la petición.

---

### 🛠️ Validación de Servicios (`Services`) ###

#### `createServiceSchema` (Creación de Servicio)  ####

| Campo | Tipo de Dato | Requerido | Restricciones / Formato | Valor por Defecto |
| :--- | :--- | :---: | :--- | :--- |
| `name` | `String` | Sí | Mínimo 2 caracteres | N/A |
| `description` | `String` | Sí | Mínimo 5 caracteres | N/A |
| `duration` | `Number` | Sí | Número positivo mayor a 0 (Soporta conversión automática desde `String` vía `z.coerce`) | N/A |
| `price` | `Number` | Sí | Número mayor o igual a 0 (Soporta conversión automática desde `String` vía `z.coerce`) | N/A |
| `category` | `String` | Sí | Mínimo 2 caracteres | N/A |
| `available` | `Boolean` | No | Valor booleano (`true` o `false`) | `true` |

#### `updateServiceSchema` (Actualización de Servicio)  ####
* **Formato**: Todos los campos de `createServiceSchema` son opcionales (`.partial()`), permitiendo actualizaciones parciales del recurso.

## 🧪 Ejemplos de Pruebas y Respuestas (Postman) ##

A continuación se muestran ejemplos reales de peticiones HTTP en Postman y las respuestas generadas en formato JSON por el servidor.

---

### 📥 1. Crear un nuevo servicio ###

* **Método**: `POST`
* **Ruta**: `/services`
* **Headers**: `Content-Type: application/json`

**Cuerpo de la Petición (Request Body):**

```json
{
  "name": "Mantenimiento Preventivo CCTV",
  "description": "Limpieza, calibración y pruebas de cámaras IP e IP Horns",
  "duration": 90,
  "price": 200000,
  "category": "Seguridad Electrónica",
  "available": true
}
```

Respuesta de la API (Response 201 Created):

```JSON
{
  "_id": "6a6ff9a92a0310d357bcdf8a",
  "name": "Mantenimiento Preventivo CCTV",
  "description": "Limpieza, calibración y pruebas de cámaras IP e IP Horns",
  "duration": 90,
  "price": 200000,
  "category": "Seguridad Electrónica",
  "available": true,
  "createdAt": "2026-08-03T02:15:05.039Z",
  "updatedAt": "2026-08-21T05:27:23.087Z",
  "__v": 0
}
```

📥 2. Crear una nueva reserva
Método: POST

Ruta: /bookings

Headers: Content-Type: application/json

Cuerpo de la Petición (Request Body):

```JSON
{
  "clientName": "Daniela Silva",
  "clientEmail": "daniela.silva@email.com",
  "date": "2026-08-11",
  "time": "09:30",
  "status": "pending"
}
```

Respuesta de la API (Response 201 Created):

```JSON
{
  "_id": "6a767dcb6e74c4b48af79ffe",
  "clientName": "Daniela Silva",
  "clientEmail": "daniela.silva@email.com",
  "date": "2026-08-11",
  "time": "09:30",
  "status": "pending",
  "services": [],
  "createdAt": "2026-08-06T06:10:02.693Z",
  "updatedAt": "2026-08-06T06:10:02.693Z",
  "__v": 0
}
```

📥 3. Añadir un servicio a una reserva existente
Método: POST

Ruta: /bookings/6a767dcb6e74c4b48af79ffe/services/6a741a8a6f50e8f6fb9ff5c5

Parámetros de Ruta:

bid: 6a767dcb6e74c4b48af79ffe (ID de la Reserva)

sid: 6a741a8a6f50e8f6fb9ff5c5 (ID del Servicio)

Cuerpo de la Petición (Request Body): (Opcional según implementación, envía la cantidad)

```JSON
{
  "quantity": 1
}
```

Respuesta de la API (Response con Populate de Mongoose):

```JSON
{
  "_id": "6a767dcb6e74c4b48af79ffe",
  "clientName": "Daniela Silva",
  "clientEmail": "daniela.silva@email.com",
  "date": "2026-08-11",
  "time": "09:30",
  "status": "pending",
  "services": [
    {
      "service": {
        "_id": "6a741a8a6f50e8f6fb9ff5c5",
        "name": "Mantenimiento Preventivo puertas vehiculares",
        "description": "Limpieza, calibración y pruebas motores y equipos",
        "duration": 60,
        "price": 3000000,
        "category": "Seguridad Electrónica",
        "available": true,
        "createdAt": "2026-08-06T05:24:26.479Z",
        "updatedAt": "2026-08-06T05:24:26.479Z",
        "__v": 0
      },
      "quantity": 1
    }
  ]
}
```


📄 4. Obtener listado general de servicios (GET /services)
Respuesta de la API (Array de Servicios):

```JSON
[
  {
    "_id": "6a6ff9a92a0310d357bcdf8a",
    "name": "Mantenimiento Preventivo CCTV",
    "description": "Limpieza, calibración y pruebas de cámaras IP e IP Horns",
    "duration": 90,
    "price": 200000,
    "category": "Seguridad Electrónica",
    "available": true,
    "createdAt": "2026-08-03T02:15:05.039Z",
    "updatedAt": "2026-08-21T05:27:23.087Z",
    "__v": 0
  },
  {
    "_id": "6a6ffb9b2a0310d357bcdf8b",
    "name": "Instalacion CCTV",
    "description": "Instalacion de 4 camaras ip",
    "duration": 120,
    "price": 40000,
    "category": "Seguridad Electrónica",
    "available": true,
    "createdAt": "2026-08-03T02:23:23.921Z",
    "updatedAt": "2026-08-03T02:23:23.921Z",
    "__v": 0
  },
  {
    "_id": "6a6ffbef2a0310d357bcdf8c",
    "name": "Instalacion Control de acceso",
    "description": "Instalacion de exclusa",
    "duration": 120,
    "price": 50000,
    "category": "Seguridad Electrónica",
    "available": true,
    "createdAt": "2026-08-03T02:24:47.509Z",
    "updatedAt": "2026-08-03T02:24:47.509Z",
    "__v": 0
  }
]
```