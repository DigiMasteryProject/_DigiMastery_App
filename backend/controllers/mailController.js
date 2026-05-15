const mailService = require("../services/mailService.js");

class SuggestionController {
  async sendSuggestion(req, res) {
    const {
      from,
      username,
      userId,
      message,
    } = req.body;

    if (!from || !message) {
      return res.status(400).json({
        ok: false,
        mensaje: "Faltan datos",
      });
    }

    try {
      await mailService.sendSuggestion(
        from,
        username,
        userId,
        message
      );

      return res.status(200).json({
        ok: true,
        mensaje: "Sugerencia enviada correctamente",
      });
    } catch (err) {
      console.log(err);

      return res.status(500).json({
        ok: false,
        mensaje: "Error al enviar sugerencia",
      });
    }
  }
}

module.exports = new SuggestionController();