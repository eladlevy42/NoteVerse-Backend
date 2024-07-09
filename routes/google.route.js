const express = require("express");
const router = express.Router();
const { signWithGoogle } = require("../controllers/google.controller");
const { verifyGoogle } = require("../middlewares/auth.middleware");

router.post("/", verifyGoogle, signWithGoogle);

module.exports = router;
