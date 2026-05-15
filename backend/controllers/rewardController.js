const { logMensaje } = require("../utils/logger.js");
const rewardService = require("../services/rewardService.js");

class RewardController {
  async getAllRewards(req, res) {
    try {
      // Parse query params and pass as filters to service when present
      const filtros = {};
      if (req.query.name) filtros.name = req.query.name;
      const rewards = Object.keys(filtros).length ? await rewardService.getAllRewards(filtros) : await rewardService.getAllRewards();
      return res.status(200).json({
        ok: true,
        datos: rewards,
        mensaje: "Recompensas recuperadas correctamente",
      });
    } catch (err) {
      logMensaje("Error en getAllRewards:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar recompensas",
      });
    }
  }

  async getRewardById(req, res) {
    const id = req.params.id;
    try {
      const d = await rewardService.getRewardById(id);
      if (!d) {
        return res.status(404).json({
          ok: false,
          datos: null,
          mensaje: "Recompensa no encontrada",
        });
      }
      return res.status(200).json({
        ok: true,
        datos: d,
        mensaje: "Recompensa recuperada correctamente",
      });
    } catch (err) {
      logMensaje("Error en getRewardById:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar la recompensa",
      });
    }
  }
}

module.exports = new RewardController();
