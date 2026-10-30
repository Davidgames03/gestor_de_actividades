const listaActividades = require('../Models/ListaEnlazada');

// Estos son los únicos estados que deja guardar
const ESTADOS = ['Pendiente', 'En proceso', 'Completada'];

// Le quita los espacios de los lados al texto; si no es texto, regresa vacío
function limpiarTexto(valor) {
    return typeof valor === 'string' ? valor.trim() : '';
}

// Revisa el nombre. Si está mal regresa el aviso, y si está bien regresa vacío
function errorDelNombre(nombre) {
    if (nombre.length < 5) {
        return 'El nombre es muy corto, escribe qué se va a hacer (mínimo 5 letras)';
    }
    if (nombre.length > 60) {
        return 'El nombre es muy largo (máximo 60 letras)';
    }
    if (nombre.includes('|') || /[\r\n]/.test(nombre)) {
        return 'El nombre no puede llevar el símbolo | ni saltos de línea';
    }
    return '';
}

// Regresa todas las actividades
const obtenerActividades = (req, res) => {
    res.json(listaActividades.toArray());
};

// Registra una actividad nueva
const crearActividad = (req, res) => {
    const datos = req.body || {};
    const nombre = limpiarTexto(datos.nombre);
    const estado = datos.estado;

    const problema = errorDelNombre(nombre);
    if (problema) {
        return res.status(400).json({ mensaje: problema });
    }
    if (!ESTADOS.includes(estado)) {
        return res.status(400).json({ mensaje: 'El estado debe ser Pendiente, En proceso o Completada' });
    }

    const nuevaActividad = listaActividades.agregar(nombre, estado);
    res.status(201).json({
        mensaje: 'Actividad registrada correctamente',
        actividad: nuevaActividad
    });
};

// Cambia el nombre o el estado de una actividad que ya existe
const actualizarActividad = (req, res) => {
    const id = Number(req.params.id);
    const datos = req.body || {};
    const nombre = datos.nombre === undefined ? undefined : limpiarTexto(datos.nombre);
    const estado = datos.estado;

    if (nombre === undefined && estado === undefined) {
        return res.status(400).json({ mensaje: 'No llegó nada para cambiar' });
    }
    if (nombre !== undefined && errorDelNombre(nombre)) {
        return res.status(400).json({ mensaje: errorDelNombre(nombre) });
    }
    if (estado !== undefined && !ESTADOS.includes(estado)) {
        return res.status(400).json({ mensaje: 'El estado debe ser Pendiente, En proceso o Completada' });
    }

    if (listaActividades.actualizar(id, nombre, estado)) {
        res.json({ mensaje: 'Actividad actualizada correctamente' });
    } else {
        res.status(404).json({ mensaje: 'No existe una actividad con ese ID' });
    }
};

module.exports = {
    obtenerActividades,
    crearActividad,
    actualizarActividad
};