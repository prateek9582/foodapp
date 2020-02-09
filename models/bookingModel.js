const mongoose = require("mongoose");
// const config = require("../configs/config");

mongoose.connect(process.env.DB,{
    useNewUrlParser: true,
    useUnifiedTopology:true
}).then(conn =>{
    console.log("Booking DB connected");
})


const bookedPlanSchema = mongoose.Schema({
    planId:{
        type:String,
        required:true
    },
    name:{
        type:String,
        requried : [true,"Please enter name of the plan"]
    },
    currentPrice:{
        type:Number,
        min: 40
    },
    bookedOn:{
        type:String,
        default:Date.now()
    }
});
const bookingSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    bookedPlans:{
        type:[bookedPlanSchema],
        required:true
    }
})
const bookingModel = mongoose.model("bookingModel",bookingSchema);
module.exports = bookingModel;