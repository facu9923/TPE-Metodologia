class StorageManager {

	static _cargarListaObjetos(clave) {
		// No hay control de errores
		const listaStr = localStorage.getItem(clave);
		if (!listaStr)
			return null;
		return JSON.parse(listaStr);
	}

	static _guardarListaObjetos(clave, lista) {
		const listaStr = JSON.stringify(lista);
		localStorage.setItem(clave, listaStr);
	}

	/**
	 * Retorna (null) o una lista de objetos de la forma:
	 * {
	 * 		dni_medico,
	 * 		lista_turnos: [
	 * 			{
	 * 				dni_paciente,
	 * 				timestamp	
	 * 			}
	 * 		]
	 * }
	 */
	static cargarTurnos() {
		return StorageManager._cargarListaObjetos("turnos");
	}

	static guardarTurnos(turnos) {
		StorageManager._guardarListaObjetos("turnos", turnos);
	}

	static cargarPacientes() {
		const listaPacientes = StorageManager._cargarListaObjetos("pacientes");

        if (listaPacientes == null)
            return null;
        /*
        listaPacientes es una lista de objetos Persona, pero sin sus métodos
        por haber sido convertidos a JSON, por lo tanto hay que "agregarselos"
        */
        const listaPacientesConMetodos = [];
        for (let paciente of listaPacientes) {
            listaPacientesConMetodos.push(
                new Persona(paciente._dni, paciente._nombre)
            );
        }
        return listaPacientesConMetodos;
	}

	static guardarPacientes(pacientes) {
		StorageManager._guardarListaObjetos("pacientes", pacientes);
	}

	static isLogged() {
		return localStorage.getItem("logged");
	}

	static cerrarSesion() {
		localStorage.removeItem("logged");
		localStorage.removeItem("logged_as");
		localStorage.removeItem("usuario");
		localStorage.removeItem("contrasena");
	}

	static guardarLogin(login) {
		localStorage.setItem("logged", "true");
		localStorage.setItem("logged_as", login.logged_as);
		localStorage.setItem("usuario", login.usuario);
		localStorage.setItem("contrasena", login.contrasena);
	}

	static getTipoLogin() {
		return localStorage.getItem("logged_as");
	}

	static getUsuario() {
		return localStorage.getItem("usuario");
	}

}