const express = require("express");
const auth = require("./auth");
const user = require("./user");
const canvas = require("./canvas");

const { jwtAuth } = require("../middlewares/jwt-auth-mid");

const router = express.Router();

router.use("/auth", auth);
router.use("/users", jwtAuth, user);
router.use("/canvases", jwtAuth, canvas);

module.exports = router;
