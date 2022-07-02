const DEFAULT = {
    medicos: [
        new Medico(13350792, "Daniel Cesareo", "daniel_cesareo", "1234"),
        new Medico(24593969, "Humberto Sergio Eduardo", "humberto_sergio_eduardo", "1234"),
        new Medico(34065398, "Noemi de las Nieves", "noemi_de_las_nieves", "1234")
    ],
    secretarias: [
        Object.assign(new Secretaria(), {
            _dni: 42064076,
            _nombre: "Paula Herminda",
            _usuario: "paula_herminda",
            _contrasena: "1234",
            _dni_medicos: [13350792, 24593969]
        }),
        Object.assign(new Secretaria(), {
            _dni: 34597933,
            _nombre: "Francisca Santina",
            _usuario: "francisca_santina",
            _contrasena: "1234",
            _dni_medicos: [34065398]
        })
    ],
    responsables: [
        new Responsable(16532693, "Ari Iglesias", "ari_iglesias", "1234")
    ]
};