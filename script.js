const fechaElemento = document.getElementById("fecha");
const horaElemento = document.getElementById("hora");
const formatoFechaSelect = document.getElementById("formato-fecha");
const formatoHoraSelect = document.getElementById("formato-hora");
const zonaHorariaSelect = document.getElementById("zona-horaria");
const canvas = document.getElementById("mapa");
const context = canvas.getContext("2d");
const canvasReloj = document.getElementById("relojDigital");
const contextReloj = canvasReloj.getContext("2d");

/**
 * Actualiza la visualización del reloj y la fecha
 * @description Obtiene la hora actual, la ajusta según la zona horaria seleccionada
 * y actualiza los elementos de la interfaz con el formato elegido
 * @returns {void}
 */
function actualizarReloj() {
    const ahora = new Date();
    const zonaHoraria = zonaHorariaSelect.value;

    let fechaLocal = ahora;
    if (zonaHoraria === "new_york") {
        fechaLocal = new Date(ahora.toLocaleString("en-US", { timeZone: "America/New_York" }));
    } else if (zonaHoraria === "canada") {
        fechaLocal = new Date(ahora.toLocaleString("en-US", { timeZone: "America/Toronto" })); 
    } else if (zonaHoraria === "rusia") {
        fechaLocal = new Date(ahora.toLocaleString("en-US", { timeZone: "Europe/Moscow" })); 
    } else if (zonaHoraria === "china") {
        fechaLocal = new Date(ahora.toLocaleString("en-US", { timeZone: "Asia/Shanghai" })); 
    } else if (zonaHoraria === "tokyo") {
        fechaLocal = new Date(ahora.toLocaleString("en-US", { timeZone: "Asia/Tokyo" })); 
    } else if (zonaHoraria === "brazil") {
        fechaLocal = new Date(ahora.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
    } else if (zonaHoraria === "utc") {
        fechaLocal = new Date(ahora.toUTCString()); 
    }

    const formatoFecha = formatoFechaSelect.value;
    let fechaTexto = "";
    switch (formatoFecha) {
        case "dd-mm-yyyy":
            fechaTexto = `${fechaLocal.getDate().toString().padStart(2, "0")}/${(fechaLocal.getMonth() + 1).toString().padStart(2, "0")}/${fechaLocal.getFullYear()}`;
            break;
        case "mm-dd-yyyy":
            fechaTexto = `${(fechaLocal.getMonth() + 1).toString().padStart(2, "0")}-${fechaLocal.getDate().toString().padStart(2, "0")}-${fechaLocal.getFullYear()}`;
            break;
        case "yyyy.mm.dd":
            fechaTexto = `${fechaLocal.getFullYear()}.${(fechaLocal.getMonth() + 1).toString().padStart(2, "0")}.${fechaLocal.getDate().toString().padStart(2, "0")}`;
            break;
        case "fecha-completa":
            fechaTexto = fechaLocal.toDateString();
            break;
    }

    const formatoHora = formatoHoraSelect.value;
    let horaTexto = "";
    let horas = fechaLocal.getHours();
    let minutos = fechaLocal.getMinutes().toString().padStart(2, "0");
    let segundos = fechaLocal.getSeconds().toString().padStart(2, "0");

    if (formatoHora === "12h") {
        const amPm = horas >= 12 ? "PM" : "AM";
        horas = horas % 12 || 12;
        horaTexto = `${horas.toString().padStart(2, "0")}:${minutos}:${segundos} ${amPm}`;
    } else {
        horaTexto = `${horas.toString().padStart(2, "0")}:${minutos}:${segundos}`;
    }

    fechaElemento.textContent = fechaTexto;
    horaElemento.textContent = horaTexto;

    dibujarRelojDigital(fechaLocal);
}

/**
 * Dibuja un reloj en el canvas
 * @param {Date} fechaLocal - Objeto Date con la hora a mostrar
 * @returns {void}
 * @description Dibuja un reloj con manecillas para horas, minutos y segundos
 */
function dibujarRelojDigital(fechaLocal) {
    const horas = fechaLocal.getHours() % 12;
    const minutos = fechaLocal.getMinutes();
    const segundos = fechaLocal.getSeconds();

    contextReloj.clearRect(0, 0, canvasReloj.width, canvasReloj.height);

    contextReloj.beginPath();
    contextReloj.arc(100, 100, 90, 0, 2 * Math.PI);
    contextReloj.strokeStyle = "#000000";
    contextReloj.lineWidth = 2;
    contextReloj.stroke();

    contextReloj.font = "14px Arial";
    contextReloj.textAlign = "center";
    contextReloj.textBaseline = "middle";

    for(let i = 1; i <= 12; i++) {
        const angulo = (i * 30 - 90) * Math.PI / 180;
        const x = 100 + 70 * Math.cos(angulo);
        const y = 100 + 70 * Math.sin(angulo);
        contextReloj.fillText(i.toString(), x, y);
    }

    const horaAngulo = ((horas * 30) + (minutos / 2) - 90) * Math.PI / 180;
    contextReloj.beginPath();
    contextReloj.moveTo(100, 100);
    contextReloj.lineTo(
        100 + 50 * Math.cos(horaAngulo),
        100 + 50 * Math.sin(horaAngulo)
    );
    contextReloj.strokeStyle = "#000000";
    contextReloj.lineWidth = 4;
    contextReloj.stroke();

    const minutoAngulo = (minutos * 6 - 90) * Math.PI / 180;
    contextReloj.beginPath();
    contextReloj.moveTo(100, 100);
    contextReloj.lineTo(
        100 + 70 * Math.cos(minutoAngulo),
        100 + 70 * Math.sin(minutoAngulo)
    );

    contextReloj.strokeStyle = "#000000";
    contextReloj.lineWidth = 2;
    contextReloj.stroke();

    const segundoAngulo = (segundos * 6 - 90) * Math.PI / 180;
    contextReloj.beginPath();
    contextReloj.moveTo(100, 100);
    contextReloj.lineTo(
        100 + 80 * Math.cos(segundoAngulo),
        100 + 80 * Math.sin(segundoAngulo)
    );

    contextReloj.strokeStyle = "#ff0000";
    contextReloj.lineWidth = 1;
    contextReloj.stroke();

    contextReloj.beginPath();
    contextReloj.arc(100, 100, 3, 0, 2 * Math.PI);
    contextReloj.fillStyle = "#000000";
    contextReloj.fill();
}

const img = new Image();
img.src = './assets/images/tierra.jpg';

/**
 * Dibuja el mapa con las zonas horarias marcadas
 * @description Dibuja la imagen del mapa y añade etiquetas para las diferentes zonas horarias
 * @returns {void}
 */
function dibujarMapa() {
    // Limpia el canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fondo
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Países
    context.fillStyle = "rgba(255, 255, 90, 0.7)";
    context.fillRect(116, 265, 80, 20); // Fondo texto USA
    context.fillRect(112, 220, 64, 20); // Fondo texto Canadá
    context.fillRect(555, 280, 40, 20); // Fondo texto Rusia
    context.fillRect(555, 210, 40, 20); // Fondo texto China
    context.fillRect(631, 277, 40, 20); // Fondo texto Tokio
    context.fillRect(245, 380, 40, 20); // Fondo texto Brasil
    context.fillRect(346, 267, 40, 20); // Fondo texto UTC
    
    // Nombres de los países
    context.fillStyle = "#000";
    context.font = "14px Arial";
    context.fillText("Nueva York", 120, 280);
    context.fillText("Canadá", 120, 235);
    context.fillText("Rusia", 557, 225);
    context.fillText("China", 557, 295);
    context.fillText("Tokio", 635, 290);
    context.fillText("Brasil", 248, 395);
    context.fillText("UTC", 353, 284);
}

/**
 * Maneja los clics en el mapa para cambiar la zona horaria
 * @param {MouseEvent} evento - Evento del clic del mouse
 * @returns {void}
 */
canvas.addEventListener("click", (evento) => {
    const rect = canvas.getBoundingClientRect();
    const x = evento.clientX - rect.left;
    const y = evento.clientY - rect.top;

    // Coordenadas con control de escalabilidad
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const canvasX = (x * scaleX);
    const canvasY = (y * scaleY);

    // Áreas de clic para cada país
    if (canvasX >= 116 && canvasX <= 196 && canvasY >= 265 && canvasY <= 285) {
        zonaHorariaSelect.value = "new_york"; // Nueva York
    } 
    else if (canvasX >= 112 && canvasX <= 176 && canvasY >= 220 && canvasY <= 240) {
        zonaHorariaSelect.value = "canada"; // Canadá
    }
    else if (canvasX >= 555 && canvasX <= 595 && canvasY >= 280 && canvasY <= 300) {
        zonaHorariaSelect.value = "china"; // Rusia
    }
    else if (canvasX >= 555 && canvasX <= 595 && canvasY >= 210 && canvasY <= 230) {
        zonaHorariaSelect.value = "rusia"; // China
    }
    else if (canvasX >= 631 && canvasX <= 671 && canvasY >= 277 && canvasY <= 297) {
        zonaHorariaSelect.value = "tokyo"; // Tokio
    }
    else if (canvasX >= 245 && canvasX <= 285 && canvasY >= 380 && canvasY <= 400) {
        zonaHorariaSelect.value = "brazil"; // Brasil
    }
    else if (canvasX >= 346 && canvasX <= 386 && canvasY >= 267 && canvasY <= 287) {
        zonaHorariaSelect.value = "utc"; // UTC
    }

    actualizarReloj();
});

/**
 * Guarda la última configuración en localStorage
 * @description Almacena el formato de fecha, hora y zona horaria
 * @returns {void}
 */
function guardarConfiguracion() {
    localStorage.setItem("formatoFecha", formatoFechaSelect.value);
    localStorage.setItem("formatoHora", formatoHoraSelect.value);
    localStorage.setItem("zonaHoraria", zonaHorariaSelect.value);
}
/**
 * Carga toda la configuración guardada en localStorage
 * @description Recupera y aplica la última configuración guardada de formato de fecha,
 * hora y zona horaria
 * @returns {void}
 */
function cargarConfiguracion() {
    const formatoFecha = localStorage.getItem("formatoFecha");
    const formatoHora = localStorage.getItem("formatoHora");
    const zonaHoraria = localStorage.getItem("zonaHoraria");

    if (formatoFecha) formatoFechaSelect.value = formatoFecha;
    if (formatoHora) formatoHoraSelect.value = formatoHora;
    if (zonaHoraria) zonaHorariaSelect.value = zonaHoraria;

    actualizarReloj();
}

// Inicio del funcionamiento de los canvas
img.onload = dibujarMapa;
cargarConfiguracion();
setInterval(actualizarReloj, 1000);

// Escucha cambios en la fecha, hora y zona horaria para actualizar la configuración
formatoFechaSelect.addEventListener("change", () => {
    guardarConfiguracion();
    actualizarReloj();
});
formatoHoraSelect.addEventListener("change", () => {
    guardarConfiguracion();
    actualizarReloj();
});
zonaHorariaSelect.addEventListener("change", () => {
    guardarConfiguracion();
    actualizarReloj();
});