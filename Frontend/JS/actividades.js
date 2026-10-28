
document.addEventListener('DOMContentLoaded', () => {
    // Carga las actividades cuando se abre la página
    cargarActividades();

    const form = document.getElementById('formActividad');
    form.addEventListener('submit', registrarActividad);
});

// Muestra las actividades que están guardadas
async function cargarActividades() {
    try {
        const respuesta = await fetch('/actividades');
        const actividades = await respuesta.json();

        const tbody = document.getElementById('tablaActividades');
        tbody.innerHTML = '';

        // Muestra un mensaje si todavía no hay actividades
        if (actividades.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No hay actividades registradas</td></tr>`;
            return;
        }

        // Agrega a cada actividad a la tabla
        actividades.forEach(act => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${act.id}</td>
                <td>${act.nombre}</td>
                <td><span class="badge ${act.estado.toLowerCase().replace(' ', '-')}">${act.estado}</span></td>
                <td>
                    <select onchange="actualizarEstado(${act.id}, this.value)">
                        <option value="Pendiente" ${act.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                        <option value="En proceso" ${act.estado === 'En proceso' ? 'selected' : ''}>En proceso</option>
                        <option value="Completada" ${act.estado === 'Completada' ? 'selected' : ''}>Completada</option>
                    </select>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al cargar actividades:', error);
    }
}

//Guarda una nueva actividad
async function registrarActividad(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const estado = document.getElementById('estado').value;

    try {
        const respuesta = await fetch('/actividades', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, estado })
        });

        // Limpia el formulario y muestra la lista actualizada
        if (respuesta.ok) {
            document.getElementById('formActividad').reset();
            cargarActividades();
        } else {
            alert('Error al guardar la actividad');
        }
    } catch (error) {
        console.error('Error al registrar actividad:', error);
    }
}

// Cambia el estado de alguna actividad
async function actualizarEstado(id, nuevoEstado) {
    try {
        const respuesta = await fetch(`/actividades/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ estado: nuevoEstado })
        });

        // Actualiza la tabla para mostrar el nuevo estado
        if (respuesta.ok) {
            cargarActividades();
        } else {
            alert('Error al actualizar el estado');
        }
    } catch (error) {
        console.error('Error al actualizar estado:', error);
    }
}
