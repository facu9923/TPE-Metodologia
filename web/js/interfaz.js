class Interfaz {}

Interfaz.mostrarLogin = function() {
	document.getElementById("login-div").style.display = "block";
	document.querySelector(".interfaz-medico").style.display = "none";
	document.querySelector(".interfaz-secretaria").style.display = "none";
}

Interfaz.ocultarLogin = function() {
	document.getElementById("login-div").style.display = "none";
}

Interfaz.setLoginMedico = function(nombre) {
	document.getElementById("nombre-medico").innerHTML = nombre;
}

function dni_paciente_a_nombre(pacientes, dni) {
	for (paciente of pacientes)
		if (paciente.dni == dni)
			return paciente.nombre;
	return null;
}

Interfaz.setTurnos = function(turnos, pacientes) {
	const contenedorTurnos = document.querySelector(".turnos-container");
	contenedorTurnos.innerHTML="";

	for (turno of turnos) {
		const dni_paciente = turno.dni_paciente;
		const timestamp = turno.timestamp;
		const nombre_paciente = dni_paciente_a_nombre(pacientes, dni_paciente);

		const fecha = new Date(timestamp);

		const parrafo = document.createElement("p");
		parrafo.innerHTML = "Paciente: " + nombre_paciente + " - Fecha: " + fecha.toLocaleDateString() + " - Hora: " + fecha.toLocaleTimeString();
		contenedorTurnos.appendChild(parrafo);
	}
}

Interfaz.mostrarInterfazMedico = function() {
	Interfaz.ocultarLogin();
	document.querySelector(".interfaz-medico").style.display = "block";
	document.querySelector(".interfaz-secretaria").style.display = "none";
}

Interfaz.mostrarInterfazSecretaria = function() {
	Interfaz.ocultarLogin();
	document.querySelector(".interfaz-medico").style.display = "none";
	document.querySelector(".interfaz-secretaria").style.display = "block";
}

Interfaz.mostrarInterfazRelevante = function(medicos, pacientes) {

	if (!StorageManager.isLogged())
	{
		Interfaz.mostrarLogin();
		return;
	}

	if (StorageManager.getTipoLogin() == "medico")
	{
		// Configurar interfaz medico

		Interfaz.mostrarInterfazMedico();
		Interfaz.setLoginMedico(StorageManager.getUsuario());

		function indiceMedicoPorUsuario(usuario) {
			for (let i = 0; i < medicos.length; i++)
				if (medicos[i].usuario == usuario)
					return i;
			return -1;
		}

		Interfaz.setTurnos(medicos[indiceMedicoPorUsuario(StorageManager.getUsuario())].turnos, pacientes);
	}

	else
	{
		Interfaz.mostrarInterfazSecretaria();
		// Configurar interfaz secretaria
	}
}