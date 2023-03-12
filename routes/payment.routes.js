const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = router;

router.post("/create-payment-intent", async (req, res) => {
  const productId = req.body._id;

  try {
    // TODO . this is where you will later get the correct price to be paid

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1400, // this is an example for an amount of 14 EUR used for testing.
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
