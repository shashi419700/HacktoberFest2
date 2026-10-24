const express = require("express");
const aiController = require("../controller/ai.controller");

const router = express.Router();

// Only Website Generator
router.post("/generate-website", aiController.generateWebsite);

module.exports = router;
