// import router
const router = require("express").Router();

// import controller
const userController = require("../controllers/userController");
const uploadController = require("../controllers/uploadController");

//  import middleware
// const jwtMiddleware = require("../middlewares/jwt");

// api user
router.post("/login", userController.login);
router.post("/register", userController.register);
router.get("/players", userController.showPlayers);
router.get("/biodata/:username", userController.getUserByName);
router.post('/biodata/update/:username', userController.updateUser);
router.post('/upload/:username', uploadController.uploadFile);

// api game, menggunakan middleware jwt
// router.post("/create-room", jwtMiddleware.jwtAuthorization, roomController.create);
// router.post("/join-room", jwtMiddleware.jwtAuthorization, roomController.join);
// router.post("/fight", jwtMiddleware.jwtAuthorization, roomController.fight);

module.exports = router;
