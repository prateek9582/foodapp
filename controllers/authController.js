const KEY = process.env.KEY;
const userModel = require("../models/userModels");
const jwt = require("jsonwebtoken");
const Email = require("../utilites/email");
//signup
module.exports.signup = async function (req, res) {
    try {
        //1. create user
        const user = await userModel.create(req.body);
        //payload
        const id = user["_id"];
        //2.create Token
        const token = await jwt.sign({id}, KEY);
        //3. Send the token
        res.cookie("jwt", token, { httpOnly: true });
        res.json({
            user, token,
            succ : "user signed in"
        })
    }
    catch (err) {
        res.json({
            err
        })
    }
};

//login
module.exports.login = async function (req, res) {
    try {
        const { email, password } = req.body;
        console.log(password);
        const user = await userModel.findOne({ email });
        const dbpassword = user.password;
        if (dbpassword == password) {
            const id = user["_id"];
            const token = await jwt.sign({id}, KEY);
            res.cookie("jwt", token, { httpOnly: true });
            return res.json({
                succ:"user logged in"
            })
        }
        else {
            res.json({
                data: "something went wrong"
            })
        }
    } catch (err) {
        console.log(err);
        return res.json({
            err
        })
    }
}

module.exports.logout = function(req,res){
    res.cookie("jwt","dlafjhkjsn",{
        httpOnly:true,
        expires:new Date(Date.now())
    });
    res.redirect("/");
}

module.exports.isuserverified = async function (req, res, next) {
    try {
        //1.Get the token
        if((req.headers && req.headers.authorization) || (req.cookies&&req.cookies.jwt)){
            const header = (req.headers);
            const token =req.cookies.jwt ||  header.authorization.split(" ")[1];
            //2. Verify the token
            const response = await jwt.verify(token, KEY);
            // console.log(res);
            // id => findbyID=> user
            // isAuthorized => user
            // req.user=user;
            //3. If verified call next
            if (response)
            {
                const user = await userModel.findById(response.id);
                req.user = user;
                next();
            }
            else{
                next();
            }
        }
     else{
         next();
     }
    } catch (err) {
        console.log(err);
        res.json({
            err
        })
    }
}

module.exports.protectroute = async function (req, res, next) {
    try {
        //1.Get the token
        if((req.headers && req.headers.authorization)){
            const header = (req.headers);
            const token = header.authorization.split(" ")[1];
            //2. Verify the token
            const response = await jwt.verify(token, KEY);
            // console.log(res);
            // id => findbyID=> user
            // isAuthorized => user
            // req.user=user;
            //3. If verified call next
            if (response)
            {
                const user = await userModel.findById(response.id);
                req.user = user;
                next();
            }
            else{
                next();
            }
        }
     else{
         next();
     }
    } catch (err) {
        console.log(err);
        res.json({
            err
        })
    }
}

module.exports.isAuthorized = function (arr) {
    return function (req, res, next) {
        var { role } = req.user;
        if (arr.includes(role) == true) {
            next();
        } else {
            return res.json({ data: "You are not authorized" });
        }

    }
}

module.exports.forgotpassword = async function (req, res) {
    try {
        //1. email
        const { email } = req.body;
        //2. findone(email)
        const user = await userModel.findOne({ email });
        //3. generate random token
        const token = user.generateToken();
        //4. db client => token=> email
        const options = {
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: user.email, // list of receivers
            subject: "Your Reset Password Token", // Subject line
            text: token, // plain text body
            html: `<b>Your Reset Token is </b> ${token}` // html body
        }

        await user.save({ validateBeforeSave: false });
        await Email(options);
        res.json({
            data: "Your email has been send Successfully"
        })
    } catch (err) {
        console.log(err);
        res.json({
            err
        })
    }

}
module.exports.resetpassword = async function (req, res) {
    try {
        //1. Get token, password, confirmPassword
        if (req.body.token) {
            const token = req.body.token;

            let user = await userModel.findOne({ token });
            //2. Find user on basis of token
            if (user) {
                user.password = req.body.password;
                user.confirmPassword = req.body.confirmPassword;

                //3. update user
                await user.save();
                res.json({ data: "Password Updated" })
            } else {
                res.json({ data: "Your token is tampered." })
            }
        }
    } catch (err) {
        res.json({ err })
    }
}
