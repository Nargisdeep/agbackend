var express = require('express');
var router = express.Router();
const user_controller=require("../controller/user_routes")
/* GET users listing. */

router.post("/userpost",user_controller.userPost)
router.post("/emailsignin",user_controller.emailsignin)
router.post("/otpverify",user_controller.otpVerify)
router.post("/signin",user_controller.SignIn)
module.exports = router;
