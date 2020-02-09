const mongoose = require("mongoose");
const validator = require("validator");
// const config = require("../configs/config");
const crypto = require("crypto");
mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(conn => {
    console.log("User DB connected");
    // console.log(conn);
})

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        requried: [true, "Please enter name of the plan"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please enter Password of the plan"]
    },
    confirmpassword: {
        type: String,
        required: [true, "Please re-enter Password of the plan"],
        validate: function () {
            return this.password == this.confirmpassword;
        }
    },
    email: {
        type: String,
        required: [true, "Please enter Email of the plan"],
        unique: true,
        validate: validator.isEmail
    },
    phone: {
        type: Number,
        required: [true, "Please enter the phone no."]
    },
    role: {
        type: String,
        default: "User",
        enum: ["Admin", "User", "Resto owner", "Delivery boy"]
    },
    photo : {
        type:"string",
        default:"default.jpeg"
    },
    token: String,
    userBookedPlanId:{
        type:String
    }
});
userSchema.pre("save", function () {
    this.confirmpassword = undefined;
})
userSchema.method("generateToken", function () {
    //DB
    this.token = crypto.randomBytes(32).toString("hex");
    //email
    return this.token;
})

const userModel = mongoose.model("userModel", userSchema);
module.exports = userModel;