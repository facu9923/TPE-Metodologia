class Turno {

	constructor(dia, mes, ano, hora, medico, paciente) {
		this.dia = dia;
		this.mes = mes;
		this.ano = ano;
		this.hora = hora;
		this.medico = medico;
		this.paciente = paciente;
	}

	getDia() {
		return this.dia;
	}

	getMes() {
		return this.mes;
	}

	getAno() {
		return this.ano;
	}

	getHora() {
		return this.hora;
	}

}

Turno.RANGO_HORARIO = {
	MIN: 8,
	MAX: 20
};