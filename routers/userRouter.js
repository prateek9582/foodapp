const express = require("express");
const multer = require("multer");
var storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+".jpeg");
    },destination: function (req, filename, cb) {
        cb(null, 'public');
    }
  });
  

function fileFilter (req, file, cb) {

    // The function should call `cb` with a boolean
    // to indicate if the file should be accepted
    var type= file.mimetype.split("/");
    // To reject this file pass `false`, like so:
    if(type[0] != "image")
        cb(new Error('Wrong File Format'))

  
    // To accept the file pass `true`, like so:
    else
        cb(null, true)

  
}

var upload = multer({ storage: storage,
    fileFilter:fileFilter
});
const userRouter = express.Router();
const {signup,login,forgotpassword,resetpassword,protectroute} = require("../controllers/authController");
const {updateuser} = require("../controllers/userController");
userRouter.route("/signup").post(signup);
userRouter.route("/login").post(login);
userRouter.route("/forgotpassword").patch(forgotpassword);
userRouter.route("/resetpassword").patch(resetpassword);
userRouter.route("/updateuser/:id").post(protectroute,upload.single('photo'),updateuser);

module.exports = userRouter;