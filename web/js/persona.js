class Persona {

    constructor(dni, nombre) {
        this._dni = dni;
        this._nombre = nombre;
    }

    getNombre() {
        return this._nombre;
    }

    getDNI() {
        return this._dni;
    }

}