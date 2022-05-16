const medicos = [
	new Medico(13350792, "Daniel Cesareo", "daniel_cesareo", "1234"),
	new Medico(24593969, "Humberto Sergio Eduardo", "humberto_sergio_eduardo", "1234"),
	new Medico(34065398, "Noemi de las Nieves", "noemi_de_las_nieves", "1234")
];

const secretarias = [
	new Secretaria(42064076, "Paula Herminda", "paula_herminda", "1234"),
	new Secretaria(34597933, "Francisca Santina", "francisca_santina", "1234")
];

const pacientes = [];

for (let i = 0; i < 100; i++) {
	const paciente = new Paciente(
		enteroRandom(10000000, 50000000),
		nombresPacientes[enteroRandom(0, nombresPacientes.length-1)]
	);
	pacientes.push(paciente);
}

function proxTurnoDate(date) {
	date.setHours(date.getHours() + 1);
	if (date.getHours() > Turno.RANGO_HORARIO.MAX) {
		date.setHours(Turno.RANGO_HORARIO.MIN);
		date.setDate(date.getDate() + 1);
	}
}

/**
 * Agrega turnos aleatorios al medico desde AHORA
 */
function generarTurnos(medico) {

	const date = new Date();

	/*
	 * Generar entre 40 y 60 turnos corridos
	 * (Es dificil encontrar un turno muy cercano)
	 */
	for (let i = 0; i < enteroRandom(40, 60); i++) {

		proxTurnoDate(date);

		const turno = new Turno(
			date.getDate(),
			date.getMonth(),
			date.getFullYear(),
			date.getHours(),
			medico,
			pacientes[enteroRandom(0, pacientes.length-1)]
		);

		medico.agregarTurno(turno);
	}
}

for (medico of medicos) {
	generarTurnos(medico);
}

function comprobarCredenciales(usuario, contrasena) {

	function buscarEn(lista) {

		let resultado = {
			encontrado: false,
			credenciales_validas: false
		};

		for (persona of lista) {
			if (persona.usuario == usuario) {
				resultado.encontrado = true;
				if (persona.contrasena == contrasena)
					resultado.credenciales_validas = true;
				break;
			}
		}
		return resultado;
	}

	let resultado = buscarEn(medicos);
	if (resultado.encontrado) {
		resultado.tipo = "medico";
		return resultado;
	}
	resultado = buscarEn(secretarias);
	if (resultado.encontrado) {
		resultado.tipo = "secretaria";
	}
	return resultado;
}


function login() {

	const usuario = document.querySelector("#user").value;
	const contrasena = document.querySelector("#pw").value;

	const resultado_login = comprobarCredenciales(usuario, contrasena);

	if (resultado_login.encontrado == false) {
		alert("Usuario no encontrado!");
		return;
	}

	if (resultado_login.credenciales_validas == false) {
		alert("Contraseña incorrecta!");
		return;
	}

	alert("Logueado como: " + resultado_login.tipo);

	localStorage.setItem("logged", "true");
	localStorage.setItem("logged_as", resultado_login.tipo);
	localStorage.setItem("usuario", usuario);
	localStorage.setItem("contrasena", contrasena);


	document.getElementById("login-div").style.display = "none";
}


if (localStorage.getItem("logged") == "true")
	document.getElementById("login-div").style.display = "none";