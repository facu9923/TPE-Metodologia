class Medico extends Persona {

	constructor(dni, nombre, usuario, contrasena) {
		super(dni, nombre);
		this.usuario = usuario;
		this.contrasena = contrasena;
	}

	turnos = [];

	/**
	 * Retorna bool indicando disponibilidad
	 */
	turnoLibre(dia, mes, ano, hora) {
		for (let i = 0; i < turnos.length; i++) {
			const turno = turnos[i];
			if (turno.getDia() == dia
				&& turno.getMes() == mes
				&& turno.getAno() == ano
				&& turno.getHora() == hora)
					return false;
		}
		return true;
	}

	agregarTurno(turno) {
		this.turnos.push(turno);
	}

}