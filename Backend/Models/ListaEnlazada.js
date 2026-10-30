const fs = require('fs');
const path = require('path');

// Aquí se guardan las actividades
const RUTA_ARCHIVO = path.join(__dirname, '../actividades.txt');

// Cada nodo es una actividad
class Nodo {
    constructor(id, nombre, estado) {
        this.id = id;
        this.nombre = nombre;
        this.estado = estado; 
        this.siguiente = null;
    }
}

class ListaEnlazada {
    constructor() {
        this.cabeza = null; 
        this.cargarDesdeArchivo();
    }

    // Cuando prende el servidor, lee el txt y arma la lista con lo que haya
    cargarDesdeArchivo() {
        this.cabeza = null;

        // si el archivo no existe, lo crea vacío
        if (!fs.existsSync(RUTA_ARCHIVO)) {
            fs.writeFileSync(RUTA_ARCHIVO, '', 'utf-8');
            return;
        }

        const lineas = fs.readFileSync(RUTA_ARCHIVO, 'utf-8').split(/\r?\n/);

        lineas.forEach(linea => {
            const partes = linea.split('|');
            const id = Number(partes[0]);
            if (partes.length === 3 && Number.isInteger(id)) {
                this.agregarNodo(id, partes[1], partes[2]);
            }
        });
    }

    // Escribe cada actividad en un renglón del txt
    guardarEnArchivo() {
        const lineas = [];
        let actual = this.cabeza;
        while (actual) {
            lineas.push(actual.id + '|' + actual.nombre + '|' + actual.estado);
            actual = actual.siguiente;
        }
        fs.writeFileSync(RUTA_ARCHIVO, lineas.join('\n'), 'utf-8');
    }

    // Agrega una actividad al final y la guarda en el txt
    agregar(nombre, estado) {
        let nuevoId = 1;
        let ultimo = this.cabeza;
        while (ultimo && ultimo.siguiente) {
            ultimo = ultimo.siguiente;
        }
        if (ultimo) {
            nuevoId = ultimo.id + 1;
        }

        this.agregarNodo(nuevoId, nombre, estado);
        this.guardarEnArchivo();
        return { id: nuevoId, nombre: nombre, estado: estado };
    }

    // Pone un nodo al final de la lista (solo en memoria, el txt no se toca)
    agregarNodo(id, nombre, estado) {
        const nuevoNodo = new Nodo(id, nombre, estado);

        if (!this.cabeza) {
            this.cabeza = nuevoNodo;
            return;
        }

        // avanzo hasta el último nodo y lo enlazo ahí
        let actual = this.cabeza;
        while (actual.siguiente) {
            actual = actual.siguiente;
        }
        actual.siguiente = nuevoNodo;
    }

    // La paso a arreglo para poder mandarla a la página
    toArray() {
        const actividades = [];
        let actual = this.cabeza;
        while (actual) {
            actividades.push({ id: actual.id, nombre: actual.nombre, estado: actual.estado });
            actual = actual.siguiente;
        }
        return actividades;
    }

    // Busca la actividad por su id y le cambia lo que haya llegado
    actualizar(id, nuevoNombre, nuevoEstado) {
        let actual = this.cabeza;
        while (actual) {
            if (actual.id === id) {
                if (nuevoNombre !== undefined) {
                    actual.nombre = nuevoNombre;
                }
                if (nuevoEstado !== undefined) {
                    actual.estado = nuevoEstado;
                }
                this.guardarEnArchivo();
                return true;
            }
            actual = actual.siguiente;
        }
        return false;
    }
}

module.exports = new ListaEnlazada();