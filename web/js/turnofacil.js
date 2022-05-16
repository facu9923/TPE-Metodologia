/**
 * Retorna lista con pacientes aleatorios
 */
function generarPacientesAleatorios() {

	const pacientes = [];

	for (let i = 0; i < 50; i++) {
		const paciente = new Persona(
			enteroRandom(10000000, 50000000),
			nombresPacientes[enteroRandom(0, nombresPacientes.length-1)]
		);
		pacientes.push(paciente);
	}

	return pacientes;
}

/**
 * Modifica date para pasar al proximo turno
 * (Suma 1 hora o pasa al dia siguiente)
 */
function proxTurnoDate(date) {
	date.setHours(date.getHours() + 1);
	if (date.getHours() > DEFAULT.RANGO_HORARIO_TURNOS.MAX) {
		date.setHours(DEFAULT.RANGO_HORARIO_TURNOS.MIN);
		date.setDate(date.getDate() + 1);
	}
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

	let resultado = buscarEn(DEFAULT.medicos);
	if (resultado.encontrado) {
		resultado.tipo = "medico";
		return resultado;
	}
	resultado = buscarEn(DEFAULT.secretarias);
	if (resultado.encontrado) {
		resultado.tipo = "secretaria";
	}
	return resultado;
}


function loginTrigger() {

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

	ocultarLogin();
	cargarPanel();
}

function cerrarSesion() {
	localStorage.removeItem("logged");
	localStorage.removeItem("logged_as");
	localStorage.removeItem("usuario");
	localStorage.removeItem("contrasena");
	mostrarLogin();
}


/**
 * Retorna una lista de la forma:
 * [
 * 		dni_medico,
 * 		lista_turnos: [
 * 			{
 * 				dni_paciente,
 * 				timestamp
 * 			}	
 * 		]
 * ]
 */
function obtenerTurnosCompletos(medicos) {
	let turnosCompletos = [];
	for (medico of medicos) {
		turnosCompletos.push({
			dni_medico: medico.dni,
			lista_turnos: medico.getListaTurnos()
		});
	}
	return turnosCompletos;
}

/**
 * Asigna los turnosCompletos (en el formato del localStorage) a los
 * medicos
 */
function asignarTurnosAMedicos(turnosCompletos, medicos) {

	/**
	 * Retorna la posicion en el arreglo de medicos
	 */
	function indiceMedico(dni) {
		for (let i = 0; i < medicos.length; i++)
			if (medicos[i].dni == dni)
				return i;
		return -1;
	}

	for (let i = 0; i < turnosCompletos.length; i++) {
		medicos[indiceMedico(turnosCompletos[i].dni_medico)].setListaTurnos(
			turnosCompletos[i].lista_turnos
		);
	}
}


// PARA DEBUG
let medicos;
let pacientes;
let secretarias;


function cargarPanel() {

	medicos = DEFAULT.medicos;
	secretarias = DEFAULT.secretarias;
	
	// Cargar pacientes del localstorage (si los hay)

	pacientes = StorageManager.cargarPacientes();
	if (pacientes == null) {
		pacientes = generarPacientesAleatorios();
		StorageManager.guardarPacientes(pacientes);

		/*
			Nota por si falla algo: Se esta pasando new Persona()
			que debe ser "compatible" con { dni, nombre }
		*/
	}

	// Cargar turnos del localstorage (si los hay)
	let turnosCompletos = StorageManager.cargarTurnos();

	if (turnosCompletos == null) {
		// Generar turnos aleatorios
		for (medico of medicos)
			medico.generarTurnosRandom(pacientes);
	}
	else {
		asignarTurnosAMedicos(turnosCompletos, medicos);
	}

	// Actualizar turnos ya pasados y agregar mas si es necesario

	for (medico of medicos) {
		medico.eliminarTurnosAntesDe(Date.now());
		medico.generarTurnosRandom(pacientes);
	}

	turnosCompletos = obtenerTurnosCompletos(medicos);
	StorageManager.guardarTurnos(turnosCompletos);


	// En este punto esta todo cargado y actualizado

	

}


function ocultarLogin() {
	document.getElementById("login-div").style.display = "none";
}

function mostrarLogin() {
	document.getElementById("login-div").style.display = "block";
}


(function main() {
	if (localStorage.getItem("logged") == "true") {
		ocultarLogin();
		cargarPanel();
	}
})();