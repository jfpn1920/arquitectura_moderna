// ===== Configuración inicial =====
const CLAVE = "arquitecturaModerna"; // clave con la que se guarda en localStorage
let datos = {}; // forma: { torre: { gusta: false, nota: "" }, ... }
// ===== Referencias a elementos del HTML =====
const tarjetas = document.querySelectorAll(".tarjeta");
const textoResumen = document.getElementById("textoResumen");
const btnReiniciar = document.getElementById("btnReiniciar");
// ===== Funciones de localStorage =====
// Lee los datos guardados (si existen) al abrir o refrescar la página
function cargarDatos() {
    try {
        const guardado = localStorage.getItem(CLAVE);
        if (guardado) datos = JSON.parse(guardado); // convierte el texto en objeto
    } catch (error) {
      datos = {}; // si algo falla, empieza de cero
    }
}
// Guarda el objeto "datos" como texto en localStorage
function guardarDatos() {
    localStorage.setItem(CLAVE, JSON.stringify(datos));
}
// ===== Funciones de apoyo =====
// Devuelve los datos de un edificio; si no existen, los crea vacíos
function obtenerEdificio(id) {
    if (!datos[id]) datos[id] = { gusta: false, nota: "" };
    return datos[id];
}
// ===== Funciones que actualizan la pantalla =====
// Dibuja una tarjeta con sus datos guardados
function pintarTarjeta(tarjeta) {
    const edificio = obtenerEdificio(tarjeta.dataset.id);
    tarjeta.classList.toggle("favorita", edificio.gusta); // resalta si te gusta
    tarjeta.querySelector(".nota").value = edificio.nota; // restaura la nota
    tarjeta.querySelector(".btn-gusta").textContent = edificio.gusta ? "♥ Te gusta" : "♡ Me gusta";
}
// Escribe cuántos edificios te gustan y cuáles son
function pintarResumen() {
    const nombres = [];
    tarjetas.forEach(function (tarjeta) {
        if (obtenerEdificio(tarjeta.dataset.id).gusta) {
            nombres.push(tarjeta.querySelector("h2").textContent); // toma el nombre del título
        }
    });
    textoResumen.textContent = nombres.length
        ? nombres.length + " de " + tarjetas.length + ": " + nombres.join(", ")
        : "Aún no has marcado ningún edificio.";
}
// Redibuja toda la página
function pintarTodo() {
    tarjetas.forEach(pintarTarjeta);
    pintarResumen();
}
// ===== Eventos =====
// Cada evento guarda los datos en localStorage
// Así nada se pierde al refrescar la página
// Después se actualiza solo lo que cambió
// Eventos de cada tarjeta
tarjetas.forEach(function (tarjeta) {
    const id = tarjeta.dataset.id;
    // Al escribir una nota, se guarda al instante
    tarjeta.querySelector(".nota").addEventListener("input", function (e) {
        obtenerEdificio(id).nota = e.target.value;
        guardarDatos();
    });
    // Al pulsar el botón, el edificio pasa a gustar o dejar de gustar
    tarjeta.querySelector(".btn-gusta").addEventListener("click", function () {
        const edificio = obtenerEdificio(id);
        edificio.gusta = !edificio.gusta;
        guardarDatos();
        pintarTarjeta(tarjeta);
        pintarResumen();
    });
});
// Botón de reinicio: pide confirmación y borra todo
btnReiniciar.addEventListener("click", function () {
    if (confirm("¿Seguro que quieres borrar todos los datos?")) {
        localStorage.removeItem(CLAVE);
        datos = {};
        pintarTodo();
    }
});
cargarDatos(); // primero se leen los datos guardados
pintarTodo();  // luego se dibuja la pantalla con esos datos