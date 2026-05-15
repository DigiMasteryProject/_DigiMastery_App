const express = require("express");
const mailController = require("../controllers/mailController.js");

const router = express.Router();

router.post("/", mailController.sendSuggestion);

module.exports = router;