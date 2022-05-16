class Medico extends Persona {

	constructor(dni, nombre, usuario, contrasena, matricula) {
		super(dni, nombre);
		this.usuario = usuario;
		this.contrasena = contrasena;
		this.turnos = [];
	}

	getListaTurnos() {
		return this.turnos;
	}

	setListaTurnos(lista) {
		this.turnos = lista;
	}

	agregarTurno(dni_paciente, timestamp) {
		this.turnos.push({
			dni_paciente,
			timestamp
		});
	}

	eliminarTurnosAntesDe(timestamp) {
		while(this.turnos.length && this.turnos[0].timestamp < timestamp)
			this.turnos.shift();
	}

	generarTurnosRandom(listaPacientes) {

		const date = new Date();

		// Para que no afecten al timestamp del turno...
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);

		/*
		 * Generar entre 40 y 60 turnos corridos
		 * (Es dificil encontrar un turno muy cercano)
		 */
		for (let i = this.turnos.length; i < enteroRandom(40, 60); i++) {

			proxTurnoDate(date);

			// 5% de chance de "dejar un hueco" en los turnos
			if (Math.random() < 0.05)
				continue;

			this.agregarTurno(
				listaPacientes[enteroRandom(0, listaPacientes.length-1)].dni,
				date.getTime()
			);
		}


	}

}