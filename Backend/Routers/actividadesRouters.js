const express = require('express');
const router = express.Router();
const actividadesController = require('../Controllers/actividadesController');

// Ruta para consultar todas las actividades
router.get('/actividades', actividadesController.obtenerActividades);

// Ruta para registrar una nueva actividad
router.post('/actividades', actividadesController.crearActividad);

// Ruta para cambiar el estado de una actividad usando su ID
router.put('/actividades/:id', actividadesController.actualizarActividad);

module.exports = router;