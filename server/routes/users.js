const express = require("express");
const UserController = require("../controllers/user-controller");
const { authentication } = require("../middlewares/auth");
const router = express.Router();

router.post("/login", UserController.login);
router.post("/google-login", UserController.googleLogin);
router.post("/register", UserController.createUser);
router.get("/users", authentication, UserController.getUsers);

module.exports = router;