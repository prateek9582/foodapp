const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const planRouter = require("./routers/planRouter");
const userRouter = require("./routers/userRouter");
const viewRouter = require("./routers/viewRouter");
const bookingRouter = require("./routers/bookingRouter");
app.use(express.static("public"));
//pug => render

app.use(bodyParser.raw({type:'application/json'}));
app.post('/webhook-checkout',createbooking);
//form se input lete h to ye likhna mandatory h
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "pug");
app.set("views", "views");
app.use(cookieParser());
app.use(express.json());//use to convet buffer to json file
// app.get("/",function(req,res){
//     res.render("base.pug");
// })
// app.post("/api/login",function(req,res){
//     console.log(req);
//     res.json({
//         data:"User verified"
//     })
// })
app.use("/plans", express.static("public"));
app.use("/", viewRouter);
app.use("/api/plans", planRouter);
app.use("/api/users", userRouter);
app.use("/api/booking", bookingRouter);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server is listening at port "+port);
});

