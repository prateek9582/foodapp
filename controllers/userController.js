// const users = require("../data/users");
const users = require("../models/userModels");
const userModel = require("../models/userModels");

module.exports.getallusers = (req,res)=>{
    res.json({
        users:users
    })
    res.end();
}

module.exports.createuser =async (req,res)=>{
    try{
        const user = req.body;
        const newuser = await planModel.create(user);
        res.json({
            newuser
        })}
        catch(err){
            res.json({
                err
            })
        }
}

module.exports.deleteuser = async function(req,res){
    try{
    const id = req.params.id;
    const deleteduser = await userModel.findByIdAndDelete(id);
    res.json({
        deleteduser
    })}
    catch(err){
        res.json({
            err
        })
    }
}
module.exports.getuser = async function(req,res){
    const id = req.params.id;
    const user = await  userModel.findOne(id);
    res.json({
        user
    })
}

module.exports.updateuser = async function(req,res){
    try{
        console.log(req.file);
        const id  = req.params.id;
        const photo = req.file.filename;
        req.body.photo = photo;
        const newuser = await userModel.findOneAndUpdate({_id:id},req.body,{new : true});
        res.redirect("/me");
    }
        catch(err){
            console.log(err);
            res.json({
                err
            })
        }
}