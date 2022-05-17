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

Interfaz.setTurnos = function(turnos) {
	const contenedorTurnos = document.querySelector(".turnos-container");
	contenedorTurnos.innerHTML="";

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
	Interfaz.ocultarLogin();
	document.querySelector(".interfaz-medico").style.display = "block";
	document.querySelector(".interfaz-secretaria").style.display = "none";
}

Interfaz.mostrarInterfazSecretaria = function() {
	Interfaz.ocultarLogin();
	document.querySelector(".interfaz-medico").style.display = "none";
	document.querySelector(".interfaz-secretaria").style.display = "block";
}

Interfaz.mostrarInterfazRelevante = function(medicos) {

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

		Interfaz.setTurnos(medicos[indiceMedicoPorUsuario(StorageManager.getUsuario())].turnos);
	}

	else
	{
		Interfaz.mostrarInterfazSecretaria();
		// Configurar interfaz secretaria
	}
}