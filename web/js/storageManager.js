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

	/**
	 * Retorna (null) o una lista de objetos de la forma:
	 * {
	 * 		dni,
	 * 		nombre
	 * }
	 */
	static cargarPacientes() {
		return StorageManager._cargarListaObjetos("pacientes");
	}

	static guardarPacientes(pacientes) {
		StorageManager._guardarListaObjetos("pacientes", pacientes);
	}
}