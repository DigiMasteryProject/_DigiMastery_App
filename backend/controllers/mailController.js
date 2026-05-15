const mailService = require("../services/mailService.js");
async sendSuggestion(req, res) {
  const { from, username, userId, message } = req.body;

  if (!from || !message) {
    return res.status(400).json({ ok: false, mensaje: "Faltan datos" });
  }

  // 🔥 RESPONDES INMEDIATO
  res.status(200).json({
    ok: true,
    mensaje: "Sugerencia recibida",
  });

  // 🔥 ENVÍO EN BACKGROUND
  mailService
    .sendSuggestion(from, username, userId, message)
    .catch((err) => {
      console.log("❌ Mail error:", err);
    });
}

module.exports = new SuggestionController();
