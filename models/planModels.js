const mongoose = require("mongoose");
// const config = require("../configs/config");

mongoose.connect(process.env.DB,{
    useNewUrlParser: true,
    useUnifiedTopology:true
}).then(conn =>{
    console.log("Plan DB connected");
})

const planSchema = new mongoose.Schema({
    name:{
        type:String,
        requried : [true,"Please enter name of the plan"]
    },
    rating:{
        type:Number,
        default : 5
    },
    averagerating:{
        type: Number,
        default : 6
    },
    description:{
        type:String,
        default:"Good plan"
    },
    preference : {
        type:String,
        enum:["Vegan","Vegeterian","Non-veg","Eggetarian"]
    },
    price:{
        type:Number,
        min: 40
    },
    duration:{
        type:Number,
        default:30
    },
    cover:{
        type:String,
        required:true
    },
    pictures:{
        type:[String],
        required:true
    }
});

const planModel = mongoose.model("planModel",planSchema);
module.exports = planModel;