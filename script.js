const apiUrl = 'https://script.google.com/macros/s/AKfycbzekEnzgeS1ih6TAv72pBF6kzwV1MT8RPbcqG45NrATawSQ8J1eluI6bIwAJYzn0Qs_OA/exec';

function mostrarMensaje(msg) {
  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.innerHTML = `<p>${msg}</p>`;
}

function mostrarPrivilegios(privilegios) {
  const resultadosDiv = document.getElementById('resultado');

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const privilegiosFuturos = privilegios.filter(p => {
    const fechaP = new Date(p.fecha);
    fechaP.setHours(0, 0, 0, 0);
    return fechaP >= hoy;
  });

  if (privilegiosFuturos.length === 0) {
    resultadosDiv.innerHTML = `<p>No tenés más privilegios pendientes este mes.</p>`;
    return;
  }

  let html = `
    <table border="1" cellspacing="0" cellpadding="5">
      <thead>
        <tr>
          <th>Privilegio</th>
          <th>Servicio</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
  `;

  privilegiosFuturos.forEach(p => {
    const fechaFormateada = formatearFecha(p.fecha);
    html += `
      <tr>
        <td>${p.privilegio}</td>
        <td>${p.servicio}</td>
        <td>${fechaFormateada}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  resultadosDiv.innerHTML = html;
}

function formatearFecha(fechaStr) {
  const fecha = new Date(fechaStr);
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  return `${dia}-${mes}-${anio}`;
}

function buscarPrivilegios(nombreInput, apellidoInput) {
  if (!nombreInput || !apellidoInput) {
    mostrarMensaje('Por favor, ingrese nombre y apellido.');
    return;
  }

  mostrarMensaje('Buscando privilegios...');

  fetch(`${apiUrl}?nombre=${encodeURIComponent(nombreInput)}&apellido=${encodeURIComponent(apellidoInput)}`)
    .then(response => response.json())
    .then(data => {
      if (data.length === 0) {
        mostrarMensaje('No se encontraron privilegios para ese miembro.');
      } else {
        mostrarPrivilegios(data);
      }
    })
    .catch(error => {
      console.error('Error al obtener privilegios:', error);
      mostrarMensaje('Error al obtener privilegios.');
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.getElementById('busquedaForm');

  formulario.addEventListener('submit', (event) => {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    buscarPrivilegios(nombre, apellido);
  });
});
