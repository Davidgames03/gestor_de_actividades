const fs = require('fs');
const path = require('path');

const RUTA_ARCHIVO = path.join(__dirname, '../actividades.txt');

class Nodo {
    constructor(id, nombre, estado) {
        this.id = id;
        this.nombre = nombre;
        this.estado = estado; // 'Pendiente', 'En proceso', 'Completada'
        this.siguiente = null;
    }
}

class ListaEnlazada {
    constructor() {
        this.cabeza = null;
        this.cargarDesdeArchivo();
    }

    // Carga los datos guardados en el TXT al iniciar el programa
    cargarDesdeArchivo() {
        this.cabeza = null; // Limpia la lista en memoria

        if (!fs.existsSync(RUTA_ARCHIVO)) {
            fs.writeFileSync(RUTA_ARCHIVO, '', 'utf-8');
            return;
        }

        const contenido = fs.readFileSync(RUTA_ARCHIVO, 'utf-8').trim();
        if (!contenido) return;

        const lineas = contenido.split('\n');
        lineas.forEach(linea => {
            if (linea.trim()) {
                const [id, nombre, estado] = linea.split('|');
                this.agregarNodo(Number(id), nombre, estado);
            }
        });
    }

    // Guarda el estado actual de la lista en el TXT
    guardarEnArchivo() {
        const lineas = [];
        let actual = this.cabeza;
        while (actual) {
            lineas.push(`${actual.id}|${actual.nombre}|${actual.estado}`);
            actual = actual.siguiente;
        }
        fs.writeFileSync(RUTA_ARCHIVO, lineas.join('\n'), 'utf-8');
    }

    // Agrega actividad al final de la lista
    agregar(nombre, estado) {
        let nuevoId = 1;
        if (this.cabeza) {
            let ultimo = this.cabeza;
            while (ultimo.siguiente) {
                ultimo = ultimo.siguiente;
            }
            nuevoId = ultimo.id + 1;
        }

        this.agregarNodo(nuevoId, nombre, estado);
        this.guardarEnArchivo();
        return { id: nuevoId, nombre, estado };
    }

    agregarNodo(id, nombre, estado) {
        const nuevoNodo = new Nodo(id, nombre, estado);
        if (!this.cabeza) {
            this.cabeza = nuevoNodo;
        } else {
            let actual = this.cabeza;
            while (actual.siguiente) {
                actual = actual.siguiente;
            }
            actual.siguiente = nuevoNodo;
        }
    }

    toArray() {
        const actividades = [];
        let actual = this.cabeza;
        while (actual) {
            actividades.push({
                id: actual.id,
                nombre: actual.nombre,
                estado: actual.estado
            });
            actual = actual.siguiente;
        }
        return actividades;
    }

    // Actualiza el estado de una actividad por un ID
    actualizarEstado(id, nuevoEstado) {
        let actual = this.cabeza;
        while (actual) {
            if (actual.id === Number(id)) {
                actual.estado = nuevoEstado;
                this.guardarEnArchivo();
                return true;
            }
            actual = actual.siguiente;
        }
        return false;
    }
}

module.exports = new ListaEnlazada();