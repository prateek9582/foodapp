const planmodel = require("../models/planModels");
module.exports.getHomePage = async function(req,res){
    const user = req.user;
    const plans = await planmodel.find();
    console.log(plans);
    res.render("home.pug",{title:"Home Page",plans:plans,user:user});
};
module.exports.getPlanPage = async function(req,res){
    const user = req.user;
    const plans = await planmodel.find();
    res.render("planpage.pug",{plans:plans,user:user});
}
module.exports.getLoginPage = function(req,res){
    res.render("login.pug");
}
module.exports.getSignupPage = function(req,res){
    res.render("signup.pug");
}
module.exports.userpage = function(req,res){
    const user = req.user;
    res.render("me.pug",{user:user});
    
}
module.exports.getupdatepage = function(req, res){
    const user = req.user;
    res.render("updateuser.pug",{user});
}
module.exports.getplandetailpage =async function(req,res){
    console.log(req.params);
    const user = req.user;
    const id = req.params.id;
    const plan = await planmodel.findById(id);
    res.render("plandetailpage.pug",{plan,user});
}