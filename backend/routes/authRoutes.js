const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { register, login, updateInterests, getProfile } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/update-interests", updateInterests);
router.get("/profile", authMiddleware, getProfile);


module.exports = router;
