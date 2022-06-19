class StorageManager {

    static eliminarTodo() {
        localStorage.clear();
    }

    static cargarListaObjetos(clave) {

        if (!StorageManager._existeClave(clave)) {
            console.log(`${clave} no encontrada en localStorage`);
            return null;
        }

        let parseado = JSON.parse(localStorage.getItem(clave));
        parseado = asignarMetodos(parseado);

        return parseado;
    }

    static guardarListaObjetos(clave, lista) {
        const listaStr = JSON.stringify(lista);
        localStorage.setItem(clave, listaStr);
    }

    static _existeClave(clave) {
        return Boolean(localStorage.getItem(clave));
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

    static guardarDatos(pacientes, medicos, secretarias) {
        StorageManager.guardarListaObjetos("pacientes", pacientes);
        StorageManager.guardarListaObjetos("medicos", medicos);
        StorageManager.guardarListaObjetos("secretarias", secretarias);
    }
}