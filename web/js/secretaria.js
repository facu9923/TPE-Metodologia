class Secretaria extends Persona {

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