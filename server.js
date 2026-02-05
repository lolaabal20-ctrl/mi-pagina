const express = require("express");
const cors = require("cors");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en variables de entorno");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

app.get("/mensajes", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("mensajes")
      .select("id, texto, creado_en")
      .order("id", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

app.post("/mensajes", async (req, res) => {
  try {
    const texto = req.body.texto;

    if (!texto || !texto.trim()) {
      return res.status(400).send("mensaje vacío");
    }

    const { error } = await supabase
      .from("mensajes")
      .insert([{ 
        texto: texto.trim(),
        creado_en: new Date().toISOString()
      }]);

    if (error) throw error;

    res.send("ok");
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor escuchando en puerto", PORT);
});
