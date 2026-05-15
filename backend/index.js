// index.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const path = require("path");

const sequelize = require("./config/sequelize");

const app = express();

app.set("trust proxy", 1);

// =========================
// MIDDLEWARES
// =========================

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

// =========================
// MODELOS
// =========================

require("./models/init-models")(sequelize);

// =========================
// RUTAS
// =========================

app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/userRoute"));
app.use("/digimon", require("./routes/digimonRoute"));
app.use("/digimon_evolution", require("./routes/digimonEvolutionRoute"));
app.use("/campaign", require("./routes/campaignRoute"));
app.use("/family", require("./routes/familyRoute"));
app.use("/reward", require("./routes/rewardRoute"));
app.use("/skill", require("./routes/skillRoute"));
app.use("/code_shard", require("./routes/codeShardRoute"));
app.use("/human", require("./routes/humanRoute"));
app.use("/npc", require("./routes/npcRoute"));
app.use("/other_digimon", require("./routes/otherDigimonRoute"));
app.use("/partner_digimon", require("./routes/partnerDigimonRoute"));
app.use("/session", require("./routes/sessionRoute"));
app.use("/user_campaign", require("./routes/userCampaignRoute"));
app.use("/suggestions", require("./routes/mailRoute"));

// =========================
// ROOT
// =========================

app.get("/", (req, res) => {
  res.json({
    mensaje: "DigiMastery API running 🚀",
  });
});

// =========================
// ERROR HANDLER
// =========================

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: "Internal server error",
  });
});

// =========================
// IMPORT SQL
// =========================

const importDatabaseIfNeeded = async () => {
  try {
    const [tables] = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM information_schema.tables
      WHERE table_schema = ?
    `, {
      replacements: [process.env.DB_NAME],
    });

    if (tables[0].count > 0) {
      console.log("✅ Database already initialized");
      return;
    }

    console.log("📊 Importing database schema...");

    const sqlFile = path.join(
      __dirname,
      "sql",
      "_DIGIMASTERY_DB_.sql"
    );

    const sqlContent = fs.readFileSync(sqlFile, "utf8");

    await sequelize.query(sqlContent);

    console.log("✅ Database imported successfully");

  } catch (error) {
    console.error("❌ SQL import error:", error);
  }
};

// =========================
// START SERVER
// =========================

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await sequelize.authenticate();

    console.log("✅ MySQL connected");

    await importDatabaseIfNeeded();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Startup error:", error);
  }
};

startServer();
