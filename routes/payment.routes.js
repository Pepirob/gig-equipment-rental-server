const Equipment = require("../models/Equipment.model");
const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = router;

router.post("/create-payment-intent", async (req, res, next) => {
  const equipId = req.body._id;

  try {
    // TODO: pass DAY AMOUNT from Frontend service
    const equipment = await Equipment.findById(equipId).select({
      pricePerDay: 1,
      deposit: 1,
    });

    const totalToCents = (equipment.pricePerDay + equipment.deposit) * 100;

    const customer = await stripe.customers.create();

    const paymentIntent = await stripe.paymentIntents.create({
      customer: customer.id,
      amount: totalToCents,
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret, // the client secret will be sent to the FE after the stripe payment intent creation
    });
  } catch (error) {
    next(error);
  }
});
