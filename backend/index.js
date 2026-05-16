require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const path = require("path");

const sequelize = require("./config/sequelize");

const app = express();

/* =========================
   PROXY (RAILWAY / HEROKU)
========================= */
app.set("trust proxy", 1);

/* =========================
   CORS SAFE (WEB + APK + MOBILE)
========================= */
const allowedOrigins = [
  "http://localhost:8081",
  "http://localhost:3000",
  "http://localhost:19006",
  "http://localhost:19000",
  "https://backend-production-cae42.up.railway.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // permitir Postman / apps móviles
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, true); // 👈 en prod evitas bloqueos silenciosos
    },
    credentials: false,
  })
);

/* =========================
   BODY PARSERS
========================= */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* =========================
   RATE LIMIT (RAILWAY SAFE)
========================= */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,

  keyGenerator: (req) => {
    const forwarded = req.headers["x-forwarded-for"];

    // Railway / proxies
    if (typeof forwarded === "string" && forwarded.length > 0) {
      return forwarded.split(",")[0].trim();
    }

    // fallback seguro
    return req.ip || "unknown-ip";
  },

  standardHeaders: true,
  legacyHeaders: false,

  skip: (req) => req.method === "OPTIONS",

  message: {
    ok: false,
    mensaje: "Too many requests. Please try again later.",
  },
});

app.use(limiter);

/* =========================
   DEBUG MIDDLEWARE (MUY IMPORTANTE)
========================= */
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

/* =========================
   MODELS
========================= */
require("./models/init-models")(sequelize);

app.all("*", (req, res, next) => {
  console.log("🔥 REQUEST:", req.method, req.url);
  next();
});

/* =========================
   ROUTES
========================= */
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

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "DigiMastery API running 🚀",
  });
});

/* =========================
   ERROR HANDLER (CRITICAL)
========================= */
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err);

  res.status(500).json({
    ok: false,
    mensaje: "Internal server error",
  });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3001;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup error:", err);
  }
};

start();
