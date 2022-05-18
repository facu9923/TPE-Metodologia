class Interfaz {}

Interfaz.mostrarLogin = function() {
	document.getElementById("login-div").style.display = "block";
	document.querySelector(".interfaz-medico").style.display = "none";
	document.querySelector(".interfaz-secretaria").style.display = "none";
}

Interfaz.ocultarLogin = function() {
	document.getElementById("login-div").style.display = "none";
}

Interfaz.setNombre = function(nombre) {
	document.getElementById("nombre-medico").innerHTML = nombre;
	document.getElementById("nombre-secretaria").innerHTML = nombre;
}

function dni_paciente_a_nombre(pacientes, dni) {
	for (paciente of pacientes)
		if (paciente.dni == dni)
			return paciente.nombre;
	return null;
}

Interfaz._crearElementoTurno = function(nombre_paciente, fecha, hora) {
	const elementoTurno = document.createElement("div");
	elementoTurno.classList.add("turno-container");
	const elementoNombrePaciente = document.createElement("div");
	elementoNombrePaciente.classList.add("nombre-paciente");
	const elementoFechaTurno = document.createElement("div");
	elementoFechaTurno.classList.add("fecha-turno");
	const elementoHoraTurno = document.createElement("div");
	elementoHoraTurno.classList.add("hora-turno");

	elementoNombrePaciente.innerHTML = nombre_paciente;
	elementoFechaTurno.innerHTML = fecha;
	elementoHoraTurno.innerHTML = hora;

	elementoTurno.appendChild(elementoNombrePaciente);
	elementoTurno.appendChild(elementoFechaTurno);
	elementoTurno.appendChild(elementoHoraTurno);

	return elementoTurno;
}

Interfaz.setTurnos = function(turnos, pacientes) {
	const contenedorTurnos = document.querySelector(".turnos-container");
	contenedorTurnos.innerHTML="";

	contenedorTurnos.appendChild(Interfaz._crearElementoTurno(
		"Paciente",
		"Día",
		"Hora"
	));

	for (turno of turnos) {
		const dni_paciente = turno.dni_paciente;
		const timestamp = turno.timestamp;
		const nombre_paciente = dni_paciente_a_nombre(pacientes, dni_paciente);
		const fechaDateObject = new Date(timestamp);
		
		const hora = fechaDateObject.toLocaleTimeString();
		const dia = fechaDateObject.toLocaleDateString();


		const elementoTurno = Interfaz._crearElementoTurno(
			nombre_paciente,
			dia,
			hora
		);

		contenedorTurnos.appendChild(elementoTurno);
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
		Interfaz.setNombre(StorageManager.getUsuario());

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
		Interfaz.setNombre(StorageManager.getUsuario());
		// Configurar interfaz secretaria
	}
}