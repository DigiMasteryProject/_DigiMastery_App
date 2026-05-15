// index.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const path = require("path");

const sequelize = require("./config/sequelize");

const app = express();

// =====================================
// IMPORTANT FOR RAILWAY / PROXIES
// =====================================

app.set("trust proxy", 1);

// =====================================
// MIDDLEWARES
// =====================================
app.use(cors({
  origin: true,
  credentials: false
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// =====================================
// RATE LIMIT
// =====================================

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// =====================================
// INIT MODELS
// =====================================

require("./models/init-models")(sequelize);

// =====================================
// ROUTES
// =====================================

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

// =====================================
// ROOT
// =====================================

app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    mensaje: "DigiMastery API running 🚀",
  });
});

// =====================================
// ERROR HANDLER
// =====================================

app.use((err, req, res, next) => {
  console.error("❌ Internal Error:", err);

  res.status(500).json({
    ok: false,
    mensaje: "Internal server error",
  });
});

// =====================================
// IMPORT DATABASE IF EMPTY
// =====================================

const importDatabaseIfNeeded = async () => {
  try {
    const dbName = process.env.DB_NAME;

    if (!dbName) {
      console.log("⚠️ DB_NAME not found, skipping SQL import");
      return;
    }

    const [tables] = await sequelize.query(
      `
      SELECT COUNT(*) as count
      FROM information_schema.tables
      WHERE table_schema = ?
      `,
      {
        replacements: [dbName],
      }
    );

    const tableCount = Number(tables[0]?.count || 0);

    if (tableCount > 0) {
      console.log("✅ Database already initialized");
      return;
    }

    console.log("📊 Importing database schema...");

    const sqlFile = path.join(
      __dirname,
      "sql",
      "_DIGIMASTERY_DB_.sql"
    );

    if (!fs.existsSync(sqlFile)) {
      console.log("⚠️ SQL file not found, skipping import");
      return;
    }

    const sqlContent = fs.readFileSync(sqlFile, "utf8");

    // 🔥 IMPORTANTE:
    // multipleStatements debe estar activado
    // en sequelize config
    await sequelize.query(sqlContent);

    console.log("✅ Database imported successfully");

  } catch (error) {
    console.error("❌ SQL import error:", error);
  }
};

// =====================================
// START SERVER
// =====================================

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
    process.exit(1);
  }
};

startServer();
