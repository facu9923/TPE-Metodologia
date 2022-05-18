class Medico extends Persona {

	constructor(dni, nombre, usuario, contrasena) {
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

		let date = new Date();

		// Si ya habia turnos creados, seguir desde el ultimo...

		if (this.turnos.length) {
			date = new Date(this.turnos[this.turnos.length-1].timestamp);
		}

		proxTurnoDate(date);
		if (date.getHours() < DEFAULT.RANGO_HORARIO_TURNOS.MIN)
			date.setHours(DEFAULT.RANGO_HORARIO_TURNOS.MIN);

		// Para que no afecten al timestamp del turno...
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);

		/*
		 * Generar entre 30 y 45 turnos corridos
		 * (Es dificil encontrar un turno muy cercano)
		 */
		for (let i = this.turnos.length; i < enteroRandom(30, 45); i++) {

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