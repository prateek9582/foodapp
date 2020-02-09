const express = require("express");
const bookingRouter = express.Router();

const {createCheckoutSession, createNewBooking} = require("../controllers/bookingController");
const {isuserverified} = require("../controllers/authController");
bookingRouter.use(isuserverified);
bookingRouter.get("/:id",createCheckoutSession);
bookingRouter.post("/createNewBooking",createNewBooking);

module.exports = bookingRouter;