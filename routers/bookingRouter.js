const express = require("express");
const bookingRouter = express.Router();

const {createCheckoutSession} = require("../controllers/bookingController");
const {isuserverified} = require("../controllers/authController");
bookingRouter.use(isuserverified);
bookingRouter.get("/:id",createCheckoutSession);

module.exports = bookingRouter;