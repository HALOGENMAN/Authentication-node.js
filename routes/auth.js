const express = require("express")
const authController = require("../controllers/auth")
const router = express.Router();

router.get("/",authController.getCreateUser)
router.post("/postCreateUser",authController.postCreateUser)

module.exports = router;