const socket = io();

// Función helper para construir el HTML de la lista de servicios popularizados
function generarHTMLServicios(services) {
  if (!services || services.length === 0) {
    return '<li><em>Sin servicios asignados aún.</em></li>';
  }

  return services
    .map(
      (s) => `
    <li>
      <strong>${s.service?.name || 'Servicio'}</strong> (x${s.quantity || 1}) - $${s.service?.price || 0}
    </li>
  `
    )
    .join('');
}

// 1. Escuchar la creación de una nueva reserva
socket.on('reserva_creada', (nuevaReserva) => {
  console.log('⚡ Nueva reserva recibida vía Socket:', nuevaReserva);

  const contenedor = document.getElementById('contenedor-reservas');
  const mensajeSinReservas = document.getElementById('sin-reservas');

  // Si no había reservas, ocultamos el mensaje de "No hay reservas"
  if (mensajeSinReservas) {
    mensajeSinReservas.remove();
  }

  if (contenedor) {
    const articulo = document.createElement('article');
    articulo.id = `reserva-${nuevaReserva._id}`;
    articulo.className = 'card';

    articulo.innerHTML = `
      <h2>Cliente: ${nuevaReserva.clientName}</h2>
      <p><strong>Email:</strong> ${nuevaReserva.clientEmail}</p>
      <p><strong>Fecha y Hora:</strong> ${nuevaReserva.date} - ${nuevaReserva.time}</p>
      <p><strong>Estado:</strong> <span class="badge">${nuevaReserva.status}</span></p>

      <hr style="border: 0; border-top: 1px solid #eee; margin: 12px 0;" />

      <h3>Servicios Contratados:</h3>
      <ul id="servicios-${nuevaReserva._id}">
        ${generarHTMLServicios(nuevaReserva.services)}
      </ul>

      <a href="/bookings/${nuevaReserva._id}" style="display: inline-block; margin-top: 8px;">Ver detalle &rarr;</a>
    `;

    // Insertar la nueva tarjeta al inicio del contenedor
    contenedor.prepend(articulo);
  }
});

// 2. Escuchar cuando se actualiza una reserva (ej. agregar un servicio)
socket.on('reserva_actualizada', (reservaActualizada) => {
  console.log('⚡ Reserva actualizada vía Socket:', reservaActualizada);

  const listaServicios = document.getElementById(`servicios-${reservaActualizada._id}`);
  if (listaServicios) {
    listaServicios.innerHTML = generarHTMLServicios(reservaActualizada.services);
  }
});


// 3. Escuchar la eliminación de una reserva
socket.on('reserva_eliminada', (data) => {
  console.log('⚡ Reserva eliminada vía Socket:', data);

  // Extraemos el id de la reserva recibida desde el backend { id: bid, booking: ... }
  const reservaId = data.id || data;

  // Buscamos la tarjeta con la misma estructura de id que usaste al crear: reserva-ID
  const articuloReservado = document.getElementById(`reserva-${reservaId}`);

  if (articuloReservado) {
    articuloReservado.remove();
  }

  // Verificamos si la lista quedó vacía para volver a mostrar el mensaje "No hay reservas"
  const contenedor = document.getElementById('contenedor-reservas');
  if (contenedor && contenedor.children.length === 0) {
    contenedor.innerHTML = '<p id="sin-reservas">No hay reservas registradas.</p>';
  }
});