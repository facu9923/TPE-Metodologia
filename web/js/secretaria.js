class Secretaria extends Persona {

	constructor(dni, nombre, usuario, contrasena) {
		super(dni, nombre);
		this.usuario = usuario;
		this.contrasena = contrasena;
	}

}