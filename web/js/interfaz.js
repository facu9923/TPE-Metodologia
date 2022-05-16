class Interfaz {}

Interfaz.mostrarLogin = function() {
	document.getElementById("login-div").style.display = "block";
}

Interfaz.ocultarLogin = function() {
	document.getElementById("login-div").style.display = "none";
}

Interfaz.setLoginMedico = function(nombre) {
	document.getElementById("nombre-medico").innerHTML = nombre;
}

Interfaz.setTurnos = function(turnos) {
	const contenedorTurnos = document.querySelector(".turnos-container");

	for (turno of turnos) {
		const dni_paciente = turno.dni_paciente;
		const timestamp = turno.timestamp;

		const fecha = new Date(timestamp);

		const parrafo = document.createElement("p");
		parrafo.innerHTML = "DNI Paciente: " + dni_paciente + " - Fecha: " + fecha.toLocaleDateString() + " - Hora: " + fecha.toLocaleTimeString();
		contenedorTurnos.appendChild(parrafo);
	}
}

Interfaz.mostrarInterfazMedico = function() {
	document.querySelector(".interfaz-medico").style.display = "block";
	document.querySelector(".interfaz-secretaria").style.display = "none";
}

Interfaz.mostrarInterfazSecretaria = function() {
	document.querySelector(".interfaz-medico").style.display = "none";
	document.querySelector(".interfaz-secretaria").style.display = "block";
}