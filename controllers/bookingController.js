const planModel = require("../models/planModels");
const userModel = require("../models/userModels");
const bookingModel = require("../models/bookingModel");
const sk = process.env.SK;
const stripe = require('stripe')(sk);


module.exports.createCheckoutSession = async function (req, res) {
    try {
        const id = req.params.id;
        // console.log(id);
        const user = req.user;
        const plan = await planModel.findById(id);
        // console.log(plan);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: user.email,
            line_items: [{
                name: plan.name,
                description: plan.description,
                amount: plan.price * 100,
                currency: 'inr',
                quantity: 1,
            }],
            success_url: `${req.protocol}://${req.get("host")}/me`,
            cancel_url: `${req.protocol}://${req.get("host")}/login`,
        });
        res.json({
            session
        })
    }
    catch (err) {
        console.log(err);
        res.json({
            err
        })
    }
}

module.exports.createNewBooking = async function (userEmail, planName) {
    try {
        const user = await userModel.findOne({ email: userEmail });
        const plan = await planModel.findOne({ name: planName });
        const userId = user["_id"];
        const planId = plan["_id"];

        if (user.userBookedPlanId == undefined) {
            const order = {
                userId: userId,
                bookedPlans: {
                    planId: planId,
                    name: plan.name,
                    currentPrice: plan.price,
                }
            }
            const neworder = await bookingModel.create(order);
            user.userBookedPlanId = neworder["_id"];
            await user.save({ validateBeforeSave: false });
            return res.json({
                neworder,
                succ: "Plan booked successfully"
            })
        }
        else {

            const bookedPlans = {
                planId: planId,
                name: plan.name,
                currentPrice: plan.price,
            }
            const booking = await bookingModel.findById(user.userBookedPlanId);
            booking.bookedPlans.push(bookedPlans);
            const newBooking = await bookingModel.findByIdAndUpdate(booking["_id"], bookedPlans, { new: true });
            return res.json({
                newBooking,
                succ: "New plan added"
            })
        }
    } catch (err) {
        res.json({
            err
        })
    }
}

module.exports.createbooking = async function (request, response) {
    const sig = request.headers["stripe-signature"];
    let event;
    const endpointSecret = process.env.END_POINT_SECRET;
    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);

        if (event.type == "payment-intend-succeeded") {
            const userEmail = event.data.object.customer_email;
            const planName = event.data.object.line_items[0].name;
            await createNewBooking(userEmail, planName);
            response.json({ received: true });
        }

    } catch (err) {
        Response.status(400).send(`Webhook Error: ${err.message}`);
    }

}