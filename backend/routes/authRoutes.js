const express = require("express");
const { register, login, updateInterests  } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/update-interests", updateInterests);

module.exports = router;
