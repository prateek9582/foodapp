const viewRouter = require("express").Router();
const{getHomePage,getPlanPage,getLoginPage,getSignupPage,userpage,getupdatepage,getplandetailpage} = require("../controllers/viewController");
const {isuserverified,logout,protectroute} = require("../controllers/authController");
viewRouter.use(isuserverified);
viewRouter.route("").get(getHomePage);
viewRouter.route("/plans").get(protectroute, getPlanPage);
viewRouter.route("/login").get(getLoginPage);
viewRouter.route("/signup").get(getSignupPage);
viewRouter.route("/logout").get(logout);
viewRouter.route("/me").get(protectroute, userpage);
viewRouter.route("/updateuser").get(getupdatepage);
viewRouter.route("/plans/:id").get(getplandetailpage);
module.exports = viewRouter;