const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const mensajes = [];

app.get("/mensajes", (req, res) => {
  res.json(mensajes);
});

app.post("/mensajes", (req, res) => {
  const texto = req.body.texto;

  if (!texto || !texto.trim()) {
    return res.status(400).send("mensaje vacío");
  }

  mensajes.push({ texto });
  res.send("ok");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor escuchando en http://localhost:3000");
});

