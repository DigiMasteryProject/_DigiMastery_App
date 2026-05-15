const { logMensaje } = require("../utils/logger.js");
const codeShardService = require("../services/codeShardService.js");

class CodeShardController {
  async getAllCodeShards(req, res) {
    try {
      // Parse query params and pass as filters to service when present
      const filtros = {};
      if (req.query.id_uc) filtros.id_uc = req.query.id_uc;
      const codeShards = Object.keys(filtros).length ? await codeShardService.getAllCodeShards(filtros) : await codeShardService.getAllCodeShards();
      return res.status(200).json({
        ok: true,
        datos: codeShards,
        mensaje: "CodeShards recuperados correctamente",
      });
    } catch (err) {
      logMensaje("Error en getAllCodeShards:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar code shards",
      });
    }
  }

  async getCodeShardById(req, res) {
    const id = req.params.id;
    try {
      const u = await codeShardService.getCodeShardById(id);
      if (!u) {
        return res.status(404).json({
          ok: false,
          datos: null,
          mensaje: "CodeShard no encontrado",
        });
      }
      return res.status(200).json({
        ok: true,
        datos: u,
        mensaje: "CodeShard recuperado correctamente",
      });
    } catch (err) {
      logMensaje("Error en getCodeShardById:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar el code shard",
      });
    }
  }

  async getCodeShardsByUserId(req, res) {
    const userId = req.params.userId;
    try {
      const shards = await codeShardService.getCodeShardsByUserId(userId);
      return res.status(200).json({
        ok: true,
        datos: shards,
        mensaje: "CodeShards del usuario recuperados correctamente",
      });
    } catch (err) {
      logMensaje("Error en getCodeShardsByUserId:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar los code shards del usuario",
      });
    }
  }

  async createCodeShard(req, res) {
    const datos = req.body;
    try {
      const nuevo = await codeShardService.createCodeShard(datos);
      return res.status(201).json({
        ok: true,
        datos: nuevo,
        mensaje: "CodeShard creado correctamente",
      });
    } catch (err) {
      logMensaje("Error en createCodeShard:", err);
      return res.status(400).json({
        ok: false,
        datos: null,
        mensaje: "Error al crear el code shard: " + err.message,
      });
    }
  }

  async updateCodeShard(req, res) {
    const id = req.params.id;
    const datos = req.body;
    try {
      const actualizado = await codeShardService.updateCodeShard(id, datos);
      if (!actualizado) {
        return res.status(404).json({
          ok: false,
          datos: null,
          mensaje: "CodeShard no encontrado",
        });
      }
      return res.status(200).json({
        ok: true,
        datos: actualizado,
        mensaje: "CodeShard actualizado correctamente",
      });
    } catch (err) {
      logMensaje("Error en updateCodeShard:", err);
      return res.status(400).json({
        ok: false,
        datos: null,
        mensaje: "Error al actualizar el code shard: " + err.message,
      });
    }
  }

  async deleteCodeShard(req, res) {
    const id = req.params.id;
    try {
      const eliminado = await codeShardService.deleteCodeShard(id);
      if (!eliminado) {
        return res.status(404).json({
          ok: false,
          datos: null,
          mensaje: "CodeShard no encontrado",
        });
      }
      return res.status(200).json({
        ok: true,
        datos: null,
        mensaje: "CodeShard eliminado correctamente",
      });
    } catch (err) {
      logMensaje("Error en deleteCodeShard:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al eliminar el code shard",
      });
    }
  }
}

module.exports = new CodeShardController();
