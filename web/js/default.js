/*const DEFAULT = {
    medicos: [
        new Medico(13350792, "Daniel Cesareo", "daniel_cesareo", "1234"),
        new Medico(24593969, "Humberto Sergio Eduardo", "humberto_sergio_eduardo", "1234"),
        new Medico(34065398, "Noemi de las Nieves", "noemi_de_las_nieves", "1234")
    ],
    secretarias: [
        new Secretaria(42064076, "Paula Herminda", "paula_herminda", "1234"),
        new Secretaria(34597933, "Francisca Santina", "francisca_santina", "1234")
    ],
    RANGO_HORARIO_TURNOS: {
        MIN: 8,
        MAX: 20
    }
};*/

const DEFAULT = {
    medicos: [
        Object.assign(new Medico(), {
            clase: "Medico",
            _dni: 13350792,
            _nombre: "Daniel Cesareo",
            _usuario: "daniel_cesareo",
            _contrasena: "1234"
        })
    ],
    secretarias: [
        Object.assign(new Secretaria(), {
            clase: "Secretaria",
            _dni: 42064076,
            _nombre: "Paula Herminda",
            _usuario: "paula_herminda",
            _contrasena: "1234",
            _dni_medicos: [13350792]
        })
    ]
};