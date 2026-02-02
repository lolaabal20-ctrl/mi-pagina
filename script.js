console.log("script conectado");

const form = document.getElementById("formulario");
const textarea = document.getElementById("mensaje");
const estado = document.getElementById("estado");
const lista = document.getElementById("listaMensajes");

async function cargarMensajes() {
  const res = await fetch("/mensajes");
  const mensajes = await res.json();

  lista.innerHTML = "";

  mensajes.forEach((m) => {
    const li = document.createElement("li");
    li.textContent = m.texto;
    lista.appendChild(li);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  await fetch("/mensajes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      texto: textarea.value
    })
  });

  estado.textContent = "Mensaje enviado 🙂";
  textarea.value = "";
  cargarMensajes();
});

cargarMensajes();
