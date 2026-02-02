const express = require("express");
const cors = require("cors");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.get("/mensajes", async (req, res) => {
  const { data, error } = await supabase
    .from("mensajes")
    .select("texto")
    .order("creado_en", { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.post("/mensajes", async (req, res) => {
  const texto = req.body.texto;

  if (!texto || !texto.trim()) {
    return res.status(400).send("mensaje vacío");
  }

  const { error } = await supabase
    .from("mensajes")
    .insert([{ texto }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.send("ok");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor escuchando");
});
