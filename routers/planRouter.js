const express = require("express");
const planRouter = express.Router();
const { protectroute, isAuthorized } = require("../controllers/authController");

const {
    deleteplan,
    getallplans,
    readplan,
    createplan,
    gettopplan,
    updateplan, checkplan
} = require("../controllers/planController");
const multer = require("multer");
var storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + ".jpeg");
    }, destination: function (req, filename, cb) {
        cb(null, 'public');
    }
});


function fileFilter(req, file, cb) {

    // The function should call `cb` with a boolean
    // to indicate if the file should be accepted
    var type = file.mimetype.split("/");
    // To reject this file pass `false`, like so:
    if (type[0] != "image")
        cb(new Error('Wrong File Format'))


    // To accept the file pass `true`, like so:
    else
        cb(null, true)


}

var upload = multer({
    storage: storage,
    fileFilter: fileFilter
});
planRouter
    .route("")
    .get(protectroute, isAuthorized(["Admin"]), getallplans)
    .post(checkplan, createplan);
planRouter.route("/best-5-plans").get(gettopplan, getallplans);
planRouter.post("/:id", upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "pictures", maxCount: 3 }
]), updateplan);
planRouter.route("/:id")
    .patch(updateplan)
    .get(readplan)
    .delete(protectroute, isAuthorized(["admin", "resto owner"]), deleteplan);
module.exports = planRouter;