// index.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors()); 
app.use(express.json());



// Configuración de la BD
const sequelize = require("./config/sequelize");

// Inicializar modelos y relaciones
require("./models/init-models")(sequelize);


// Rutas

const campaignRoute = require("./routes/campaignRoute");
const codeShardRoute = require("./routes/codeShardRoute");
const digimonRoute = require("./routes/digimonRoute");
const digimonEvolutionRoute = require("./routes/digimonEvolutionRoute");
const digimonSkillRoute = require("./routes/digimonSkillRoute");
const familyRoute = require("./routes/familyRoute");
const humanRoute = require("./routes/humanRoute");
const npcRoute = require("./routes/npcRoute");
const otherDigimonRoute = require("./routes/otherDigimonRoute");
const partnerDigimonRoute = require("./routes/partnerDigimonRoute");
const rewardRoute = require("./routes/rewardRoute");
const sessionRoute = require("./routes/sessionRoute");
const skillRoute = require("./routes/skillRoute");
const userRoute = require("./routes/userRoute");
const userCampaignRoute = require("./routes/userCampaignRoute");
const mailRoute = require("./routes/mailRoute");
const authRoute = require("./routes/auth");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas principales
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/digimon", digimonRoute);
app.use("/digimon_evolution", digimonEvolutionRoute);
app.use("/campaign", campaignRoute);
app.use("/family", familyRoute);
app.use("/reward", rewardRoute);
app.use("/skill", skillRoute);
app.use("/code_shard", codeShardRoute);
app.use("/human", humanRoute);
app.use("/npc", npcRoute);
app.use("/other_digimon", otherDigimonRoute);
app.use("/partner_digimon", partnerDigimonRoute);
app.use("/session", sessionRoute);
app.use("/user_campaign", userCampaignRoute);
app.use("/suggestions", mailRoute);
// Ruta raíz
app.get("/", (req, res) => {
  res.json({
    mensaje: "API REST de Municipios y Ordenanzas operativa 🚀",
  });
});

// Middleware de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: "Error interno del servidor",
  });
});

// Arranque del servidor
const PORT = process.env.PORT || 3001;

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Conectado a MySQL correctamente");
    app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
});
  })
  .catch((error) => {
    console.error("❌ Error al conectar con la base de datos:", error);
  });
