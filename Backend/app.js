
const express = require('express');
const path = require('path');

// Carga los datos del archivo .env
require('dotenv').config();

// Importa las rutas de las actividades
const actividadesRouters = require('./Routers/actividadesRouters');

const app = express();

// Permite que el servidor pueda leer los datos que recibe
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Indica dónde están los archivos del frontend
app.use(express.static(path.join(__dirname, '../Frontend')));

// Usa las rutas para trabajar con las actividades
app.use(actividadesRouters);

// Muestra la página principal al entrar al sitio
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/actividades.html'));
});

// Inicia el servidor
app.listen(process.env.PORT, () => {
    console.log('Servidor ejecutandose en el puerto ' + process.env.PORT);
});
