
const listaActividades = require('../Models/ListaEnlazada');

// Obtener todas las actividades que tenemos registradas
const obtenerActividades = (req, res) => {
    const actividades = listaActividades.toArray();
    res.json(actividades);
};

// Agregar una nueva actividad a la lista
const crearActividad = (req, res) => {
    const { nombre, estado } = req.body;

    // Revisa que los dos campos tengan información
    if (!nombre || !estado) {
        return res.status(400).json({ mensaje: 'Nombre y estado son obligatorios' });
    }

    const nuevaActividad = listaActividades.agregar(nombre, estado);
    res.status(201).json({
        mensaje: 'Actividad registrada correctamente',
        actividad: nuevaActividad
    });
};

// Cambia el estado de una actividad que ya existe
const actualizarActividad = (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    // Verifica que se haya escrito el nuevo estado
    if (!estado) {
        return res.status(400).json({ mensaje: 'El nuevo estado es obligatorio' });
    }

    const actualizado = listaActividades.actualizarEstado(id, estado);

    // Si se encuentra la actividad, se confirma el cambio
    if (actualizado) {
        res.json({ mensaje: 'Estado actualizado correctamente' });
    } else {
        // Si no existe una actividad con ese ID, se avisa
        res.status(404).json({ mensaje: 'Actividad no encontrada' });
    }
};

module.exports = {
    obtenerActividades,
    crearActividad,
    actualizarActividad
};
