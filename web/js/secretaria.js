class Secretaria extends Persona {

    clase = "Secretaria";

    constructor(dni, nombre, usuario, contrasena) {
        super(dni, nombre);
        this._usuario = usuario;
        this._contrasena = contrasena;
        this._medicos = [];
        this._dni_medicos = [];
    }

    getUsuario() {
        return this._usuario;
    }

    getContrasena() {
        return this._contrasena;
    }

    agregarMedico(medico) {
        this._medicos.push(medico);
    }

    getMedicos() {
        return this._medicos;
    }

    setMedicos(lista) {
        this._medicos = lista;
    }

    vincularMedicos(medicos) {
        this._medicos = [];
        for (const dni of this._dni_medicos) {
            for (const medico of medicos) {
                if (medico.getDNI() == dni)
                    this._medicos.push(medico);
            }
        }
    }
}