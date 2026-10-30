// Las partes de la página que se usan varias veces
const formulario = document.getElementById('formActividad');
const campoNombre = document.getElementById('nombre');
const campoEstado = document.getElementById('estado');
const tituloFormulario = document.getElementById('tituloFormulario');
const botonGuardar = document.getElementById('botonGuardar');
const botonCancelar = document.getElementById('botonCancelar');
const cuerpoTabla = document.getElementById('tablaActividades');
const mensaje = document.getElementById('mensaje');

// Los estados que puede tener una actividad
const ESTADOS = ['Pendiente', 'En proceso', 'Completada'];

// null = estoy registrando una actividad nueva
// con un número = estoy editando la actividad que tenga ese id
let idEditando = null;

// Muestra un aviso debajo del formulario (verde si salió bien, rojo si hubo error)
function mostrarMensaje(texto, esError) {
    mensaje.textContent = texto;
    mensaje.className = esError ? 'mensaje error' : 'mensaje ok';
}

// Le manda una petición al servidor y regresa lo que contestó
async function pedir(url, metodo, datos) {
    const opciones = { method: metodo };
    if (datos) {
        opciones.headers = { 'Content-Type': 'application/json' };
        opciones.body = JSON.stringify(datos);
    }

    const respuesta = await fetch(url, opciones);
    const cuerpo = await respuesta.json();
    return { ok: respuesta.ok, cuerpo: cuerpo };
}

// Hace una celda de la tabla con el texto que le pase
function crearCelda(texto) {
    const celda = document.createElement('td');
    celda.textContent = texto;
    return celda;
}

// Dibuja la tabla con las actividades
function dibujarTabla(actividades) {
    cuerpoTabla.textContent = '';

    // si no hay ninguna, se avisa
    if (actividades.length === 0) {
        const fila = document.createElement('tr');
        const celda = crearCelda('No hay actividades registradas');
        celda.colSpan = 5;
        celda.className = 'vacio';
        fila.appendChild(celda);
        cuerpoTabla.appendChild(fila);
        return;
    }

    actividades.forEach(actividad => {
        const fila = document.createElement('tr');

        fila.appendChild(crearCelda(actividad.id));
        fila.appendChild(crearCelda(actividad.nombre));

        // etiquetas de color para los estados
        const celdaEstado = document.createElement('td');
        const etiqueta = document.createElement('span');
        etiqueta.textContent = actividad.estado;
        etiqueta.className = 'etiqueta ' + actividad.estado.toLowerCase().replace(' ', '-');
        celdaEstado.appendChild(etiqueta);
        fila.appendChild(celdaEstado);

        // lista para cambiar el estado ahí mismo
        const celdaCambio = document.createElement('td');
        const selector = document.createElement('select');
        ESTADOS.forEach(estado => {
            const opcion = document.createElement('option');
            opcion.value = estado;
            opcion.textContent = estado;
            opcion.selected = (estado === actividad.estado);
            selector.appendChild(opcion);
        });
        selector.addEventListener('change', () => cambiarEstado(actividad.id, selector.value));
        celdaCambio.appendChild(selector);
        fila.appendChild(celdaCambio);

        // botón para editar el nombre
        const celdaEditar = document.createElement('td');
        const botonEditar = document.createElement('button');
        botonEditar.textContent = 'Editar';
        botonEditar.className = 'secundario';
        botonEditar.addEventListener('click', () => empezarEdicion(actividad));
        celdaEditar.appendChild(botonEditar);
        fila.appendChild(celdaEditar);

        cuerpoTabla.appendChild(fila);
    });
}

// Le pide las actividades al servidor y las muestra
async function cargarActividades() {
    try {
        const resultado = await pedir('/actividades', 'GET');
        if (!resultado.ok) {
            mostrarMensaje('No se pudieron cargar las actividades', true);
            return;
        }
        dibujarTabla(resultado.cuerpo);
    } catch (error) {
        mostrarMensaje('No se pudo conectar con el servidor. Revisa que esté encendido.', true);
    }
}

// Se usa al darle a "Guardar": registra una actividad nueva o guarda los cambios de la que se esta editando
async function guardarActividad(evento) {
    evento.preventDefault();

    const datos = { nombre: campoNombre.value, estado: campoEstado.value };

    // si esta editando mando un PUT, si es nueva mando un POST
    const editando = (idEditando !== null);
    const url = editando ? '/actividades/' + idEditando : '/actividades';
    const metodo = editando ? 'PUT' : 'POST';

    try {
        const resultado = await pedir(url, metodo, datos);
        if (!resultado.ok) {
            mostrarMensaje(resultado.cuerpo.mensaje, true);
            return;
        }

        terminarEdicion();
        mostrarMensaje(editando ? 'Cambios guardados' : 'Actividad registrada', false);
        cargarActividades();
    } catch (error) {
        mostrarMensaje('No se pudo conectar con el servidor. Revisa que esté encendido.', true);
    }
}

// Cambia el estado de una actividad desde la tabla
async function cambiarEstado(id, nuevoEstado) {
    try {
        const resultado = await pedir('/actividades/' + id, 'PUT', { estado: nuevoEstado });

        if (resultado.ok) {
            mostrarMensaje('Estado actualizado', false);
        } else {
            mostrarMensaje(resultado.cuerpo.mensaje, true);
        }
        cargarActividades();
    } catch (error) {
        mostrarMensaje('No se pudo conectar con el servidor. Revisa que esté encendido.', true);
    }
}

// Pasa los datos de la actividades al formulario para poder cambiarlos
function empezarEdicion(actividad) {
    idEditando = actividad.id;
    campoNombre.value = actividad.nombre;
    campoEstado.value = actividad.estado;

    tituloFormulario.textContent = 'Editar Actividad';
    botonGuardar.textContent = 'Guardar Cambios';
    botonCancelar.classList.remove('oculto');
    mensaje.classList.add('oculto');

    formulario.scrollIntoView({ behavior: 'smooth' });
    campoNombre.focus();
}

// Deja el formulario como al inicio, todo listo para una actividad nueva
function terminarEdicion() {
    idEditando = null;
    formulario.reset();

    tituloFormulario.textContent = 'Registrar Nueva Actividad';
    botonGuardar.textContent = 'Guardar Actividad';
    botonCancelar.classList.add('oculto');
}

// Aquí se conecta cada botón con lo que tiene que hacer
formulario.addEventListener('submit', guardarActividad);
botonCancelar.addEventListener('click', terminarEdicion);

// Al abrir la página muestra lo que ya está guardado
cargarActividades();