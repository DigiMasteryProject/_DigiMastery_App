const express = require("express");
const router = express.Router();

const partnerDigimonController = require("../controllers/partnerDigimonController.js");

// Middlewares (ajusta nombres a los tuyos)
const auth = require("../middleware/auth.js");


// =========================
// GET ALL
// =========================
router.get(
  "/",
  auth,
  partnerDigimonController.getAllPartnerDigimons
);


// =========================
// CREATE (USER + ADMIN)
// =========================
router.post(
  "/",
  auth,
  partnerDigimonController.createPartnerDigimon
);


// =========================
// GET BY ID
// =========================
router.get(
  "/:id",
  auth,
  partnerDigimonController.getPartnerDigimonById
);


// =========================
// UPDATE
// =========================
router.put(
  "/:id",
  auth,
  partnerDigimonController.updatePartnerDigimon
);


// =========================
// DELETE
// =========================
router.delete(
  "/:id",
  auth,
  partnerDigimonController.deletePartnerDigimon
);

module.exports = router;