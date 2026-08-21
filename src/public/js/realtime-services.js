const socket = io();
// 1. Escuchar cuando se crea un nuevo servicio
socket.on("servicio_creado", (nuevoServicio) => {
  console.log("⚡ Nuevo servicio recibido vía Socket:", nuevoServicio);

  // Asegurar el ID como String por si llega un ObjectId serializado
  const id = (nuevoServicio._id || nuevoServicio.id).toString();

  const contenedor = document.getElementById("contenedor-servicios");
  const mensajeSinServicios = document.getElementById("sin-servicios");

  if (mensajeSinServicios) {
    mensajeSinServicios.remove();
  }

  if (contenedor) {
    const articulo = document.createElement("article");
    articulo.id = `servicio-${id}`;
    articulo.className = "card";

    articulo.innerHTML = `
      <span class="badge">${nuevoServicio.category}</span>
      <h2>${nuevoServicio.name}</h2>
      <p>${nuevoServicio.description}</p>
      <p><strong>Duración:</strong> ${nuevoServicio.duration} minutos</p>
      <p><strong>Precio:</strong> $${nuevoServicio.price}</p>
      <a href="/services/${id}" style="display: inline-block; margin-top: 8px;">Ver detalle &rarr;</a>
    `;

    // Insertar el nuevo servicio al inicio de la lista
    contenedor.prepend(articulo);
  } else {
    console.warn("⚠️ No se encontró el elemento #contenedor-servicios en el DOM.");
  }
});

// 2. Escuchar cuando se elimina un servicio
socket.on("servicio_eliminado", (idServicioEliminado) => {
  console.log("⚡ Servicio eliminado recibido vía Socket:", idServicioEliminado);

  const tarjetaAEliminar = document.getElementById(`servicio-${idServicioEliminado}`);
  if (tarjetaAEliminar) {
    tarjetaAEliminar.remove();
  }

  const contenedor = document.getElementById("contenedor-servicios");
  if (contenedor && contenedor.children.length === 0) {
    contenedor.innerHTML = '<p id="sin-servicios">No hay servicios disponibles en este momento.</p>';
  }
});


// 3. Escuchar cuando se actualiza un servicio existente
socket.on("servicio_actualizado", (servicioActualizado) => {
  console.log("⚡ Servicio actualizado recibido vía Socket:", servicioActualizado);

  const tarjetaExistente = document.getElementById(`servicio-${servicioActualizado._id}`);

  if (tarjetaExistente) {
    tarjetaExistente.innerHTML = `
      <span class="badge">${servicioActualizado.category}</span>
      <h2>${servicioActualizado.name}</h2>
      <p>${servicioActualizado.description}</p>
      <p><strong>Duración:</strong> ${servicioActualizado.duration} minutos</p>
      <p><strong>Precio:</strong> $${servicioActualizado.price}</p>
      <a href="/services/${servicioActualizado._id}" style="display: inline-block; margin-top: 8px;">Ver detalle &rarr;</a>
    `;
  }
});