console.log("script conectado");

const form = document.getElementById("formulario");
const textarea = document.getElementById("mensaje");
const estado = document.getElementById("estado");
const lista = document.getElementById("listaMensajes");
const btnEnviar = document.getElementById("btnEnviar");
const btnRecargar = document.getElementById("btnRecargar");
const btnReintentar = document.getElementById("btnReintentar");
const contador = document.getElementById("contador");
const cargando = document.getElementById("cargando");
const errorCarga = document.getElementById("errorCarga");
const sinMensajes = document.getElementById("sinMensajes");

// Contador de caracteres
textarea.addEventListener("input", () => {
  const length = textarea.value.length;
  contador.textContent = `${length}/500`;
  
  if (length > 450) {
    contador.style.color = "#ff6b6b";
  } else {
    contador.style.color = "";
  }
});

// Función para formatear fecha
function formatearFecha(fechaISO) {
  if (!fechaISO) {
    return "Recién";
  }
  
  const fecha = new Date(fechaISO);
  
  // Verificar si la fecha es válida
  if (isNaN(fecha.getTime())) {
    return "Recién";
  }
  
  const ahora = new Date();
  const diferencia = ahora - fecha;
  
  // Menos de 1 minuto
  if (diferencia < 60000) {
    return "Hace un momento";
  }
  
  // Menos de 1 hora
  if (diferencia < 3600000) {
    const minutos = Math.floor(diferencia / 60000);
    return `Hace ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
  }
  
  // Menos de 24 horas
  if (diferencia < 86400000) {
    const horas = Math.floor(diferencia / 3600000);
    return `Hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
  }
  
  // Más de 24 horas - mostrar fecha
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const año = fecha.getFullYear();
  const hora = fecha.getHours().toString().padStart(2, '0');
  const mins = fecha.getMinutes().toString().padStart(2, '0');
  
  return `${dia}/${mes}/${año} ${hora}:${mins}`;
}

// Cargar mensajes con manejo de errores
async function cargarMensajes() {
  try {
    cargando.style.display = "block";
    errorCarga.style.display = "none";
    sinMensajes.style.display = "none";
    lista.innerHTML = "";
    
    const res = await fetch("/mensajes");
    
    if (!res.ok) {
      throw new Error("Error al cargar mensajes");
    }
    
    const mensajes = await res.json();
    
    cargando.style.display = "none";
    
    if (mensajes.length === 0) {
      sinMensajes.style.display = "block";
      return;
    }
    
    mensajes.forEach((m) => {
      const li = document.createElement("li");
      li.className = "mensaje-item";
      
      const textoDiv = document.createElement("div");
      textoDiv.className = "mensaje-texto";
      textoDiv.textContent = m.texto;
      
      const fechaDiv = document.createElement("div");
      fechaDiv.className = "mensaje-fecha";
      fechaDiv.textContent = formatearFecha(m.creado_en);
      
      li.appendChild(textoDiv);
      li.appendChild(fechaDiv);
      lista.appendChild(li);
      
      // Animación de entrada
      setTimeout(() => {
        li.classList.add("mensaje-visible");
      }, 10);
    });
    
  } catch (err) {
    console.error("Error al cargar mensajes:", err);
    cargando.style.display = "none";
    errorCarga.style.display = "block";
  }
}

// Enviar mensaje con validación y feedback
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const texto = textarea.value.trim();
  
  // Validación
  if (!texto) {
    mostrarEstado("Por favor escribí un mensaje", "error");
    return;
  }
  
  if (texto.length < 3) {
    mostrarEstado("El mensaje es muy corto", "error");
    return;
  }
  
  // Deshabilitar botón y mostrar loading
  btnEnviar.disabled = true;
  btnEnviar.querySelector(".btn-text").style.display = "none";
  btnEnviar.querySelector(".btn-spinner").style.display = "inline";
  
  try {
    const res = await fetch("/mensajes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        texto: texto
      })
    });
    
    if (!res.ok) {
      throw new Error("Error al enviar mensaje");
    }
    
    mostrarEstado("¡Mensaje enviado! 🙂", "success");
    textarea.value = "";
    contador.textContent = "0/500";
    contador.style.color = "";
    
    // Recargar mensajes
    await cargarMensajes();
    
  } catch (err) {
    console.error("Error al enviar:", err);
    mostrarEstado("No se pudo enviar. Intentá de nuevo", "error");
  } finally {
    // Rehabilitar botón
    btnEnviar.disabled = false;
    btnEnviar.querySelector(".btn-text").style.display = "inline";
    btnEnviar.querySelector(".btn-spinner").style.display = "none";
  }
});

// Función para mostrar estados
function mostrarEstado(mensaje, tipo) {
  estado.textContent = mensaje;
  estado.className = `estado estado-${tipo}`;
  
  // Limpiar después de 4 segundos
  setTimeout(() => {
    estado.textContent = "";
    estado.className = "estado";
  }, 4000);
}

// Botón recargar
btnRecargar.addEventListener("click", () => {
  cargarMensajes();
});

// Botón reintentar
btnReintentar.addEventListener("click", () => {
  cargarMensajes();
});

// Cargar mensajes al inicio
cargarMensajes();
