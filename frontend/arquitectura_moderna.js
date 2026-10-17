//----------------------------------------//
//--|funcionalidad_arquitectura_moderna|--//
//----------------------------------------//
const CLAVE = "arquitecturaModerna";
let datos = {};
const tarjetas = document.querySelectorAll(".tarjeta");
const textoResumen = document.querySelector("#textoResumen");
const btnReiniciar = document.querySelector("#btnReiniciar");
//----------------------------//
//--|cargar_datos_guardados|--//
//----------------------------//
function cargarDatos() {
    try {
        const guardados = localStorage.getItem(CLAVE);
        if (guardados) {
            datos = JSON.parse(guardados);
        }
    } catch (error) {
        datos = {};
    }
}
function guardarDatos() {
    localStorage.setItem(CLAVE, JSON.stringify(datos));
}
function obtenerEdificio(id) {
    if (!datos[id]) {
        datos[id] = {
            gusta: false,
            nota: ""
        };
    }
    return datos[id];
}
//-----------------------------------//
//--|mostrar_estado_de_una_tarjeta|--//
//-----------------------------------//
function pintarTarjeta(tarjeta) {
    const id = tarjeta.dataset.id;
    const edificio = obtenerEdificio(id);
    const campoNota = tarjeta.querySelector(".nota");
    const btnGusta = tarjeta.querySelector(".btn-gusta");
    tarjeta.classList.toggle("favorita", edificio.gusta);
    campoNota.value = edificio.nota;
    btnGusta.textContent = edificio.gusta
        ? "♥ Te gusta"
        : "♡ Me gusta";
}
//-------------------------------------//
//--|actualizar_resumen_de_favoritos|--//
//-------------------------------------//
function pintarResumen() {
    const nombres = [];
    tarjetas.forEach(function(tarjeta) {
        const edificio = obtenerEdificio(tarjeta.dataset.id);
        if (edificio.gusta) {
            nombres.push(
                tarjeta.querySelector("h2").textContent
            );
        }
    });
    if (nombres.length > 0) {
        textoResumen.textContent =
            nombres.length +
            " de " +
            tarjetas.length +
            ": " +
            nombres.join(", ");
    } else {
        textoResumen.textContent =
            "Aún no has marcado ningún edificio.";
    }
}
//---------------------------------//
//--|actualizar_toda_la_pantalla|--//
//---------------------------------//
function pintarTodo() {
    tarjetas.forEach(function(tarjeta) {
        pintarTarjeta(tarjeta);
    });
    pintarResumen();
}
//-----------------------------//
//--|eventos_de_las_tarjetas|--//
//-----------------------------//
tarjetas.forEach(function(tarjeta) {
    const id = tarjeta.dataset.id;
    const campoNota = tarjeta.querySelector(".nota");
    const btnGusta = tarjeta.querySelector(".btn-gusta");
    campoNota.addEventListener("input", function(evento) {
        const edificio = obtenerEdificio(id);
        edificio.nota = evento.target.value;
        guardarDatos();
    });
    btnGusta.addEventListener("click", function() {
        const edificio = obtenerEdificio(id);
        edificio.gusta = !edificio.gusta;
        guardarDatos();
        pintarTarjeta(tarjeta);
        pintarResumen();
    });
});
//----------------------------------//
//--|reiniciar_datos_del_proyecto|--//
//----------------------------------//
btnReiniciar.addEventListener("click", function() {
    const confirmar = confirm(
        "¿Quieres eliminar todos tus favoritos y notas?"
    );
    if (confirmar) {
        localStorage.removeItem(CLAVE);
        datos = {};
        pintarTodo();
    }
});
//-------------------------//
//--|iniciar_el_proyecto|--//
//-------------------------//
cargarDatos();
pintarTodo();