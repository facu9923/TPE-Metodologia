class Responsable extends Persona {

    clase = "Responsable";

    constructor(dni, nombre, usuario, contrasena) {
        super(dni, nombre);
        this._usuario = usuario;
        this._contrasena = contrasena;
    }

    getUsuario() {
        return this._usuario;
    }

    getContrasena() {
        return this._contrasena;
    }

}