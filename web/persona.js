class Persona {

	constructor(dni, nombre) {
		this.dni = dni;
		this.nombre = nombre;
	}

	imprimirDatos() {
		console.log("DNI: " + this.dni);
		console.log("Nombre: " + this.nombre);
	}

}