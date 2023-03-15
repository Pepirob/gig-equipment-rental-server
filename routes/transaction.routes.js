const isAuthenticated = require("../middlewares/auth.middlewares");
const Equipment = require("../models/Equipment.model");
const Transaction = require("../models/Transaction.model");
const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = router;

router.post(
  "/create-payment-intent",
  isAuthenticated,
  async (req, res, next) => {
    const equipId = req.body._id;
    const { username, email } = req.payload;
    const { totalDays } = req.query;

    try {
      // TODO: pass DAY AMOUNT from Frontend service
      const equipment = await Equipment.findById(equipId).select({
        pricePerDay: 1,
        deposit: 1,
      });

      const totalToCents =
        (equipment.pricePerDay * totalDays + equipment.deposit) * 100;

      const foundUser = await stripe.customers.search({
        query: `email: "${email}"`,
      });

      const getCustomer = async () => {
        if (foundUser.data.length) {
          return foundUser.data[0].id;
        } else {
          const customer = await stripe.customers.create({
            email,
            name: username,
          });

          return customer.id;
        }
      };

      // TODO bind payment method to paymentIntent instead of customer ID
      // Will implie pick credit cart from frontend,
      // tokenize it with Stripe tools,
      const paymentIntent = await stripe.paymentIntents.create({
        customer: getCustomer(),
        setup_future_usage: "off_session",
        amount: totalToCents,
        currency: "eur",
        automatic_payment_methods: {
          enabled: true,
        },
      });

      await Transaction.create({
        equipment: equipId,
        client: req.payload._id,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
      });

      res.send({
        clientSecret: paymentIntent.client_secret, // the client secret will be sent to the FE after the stripe payment intent creation
      });
    } catch (error) {
      next(error);
    }
  }
);

// PATCH "/update-payment-intent" => Actualizar intento de pago
router.patch("/update-payment-intent", async (req, res, next) => {
  const { clientSecret, paymentIntentId } = req.body;

  try {
    const updatedTransaction = await Transaction.findOneAndUpdate(
      {
        clientSecret: clientSecret,
        paymentIntentId: paymentIntentId,
      },
      {
        state: "succeeded",
      }
    );

    await Equipment.findByIdAndUpdate(updatedTransaction.equipment, {
      isAvailable: false,
    });

    res.status(200).json();
  } catch (error) {
    next(error);
  }
});

// DELETE "/transaction/:equipmentId" => Borrar transacciones por id de equipo
router.delete("/:equipmentId", async (req, res, next) => {
  const { equipmentId } = req.params;

  try {
    await Transaction.deleteMany({
      equipment: equipmentId,
    });

    res.status(200).json();
  } catch (error) {
    next(error);
  }
});

// DELETE "/transaction/user/:userId" => Borrar transacciones por id de usuario
router.delete("/user/:userId", async (req, res, next) => {
  const { userId } = req.params;

  try {
    const allTransactions = await Transaction.find({
      state: { $in: ["incomplete", "returned"] },
    })
      .select({ equipment: 1, client: 1 })
      .populate("equipment", "owner");

    const userTransactions = allTransactions
      .filter((transaction) => {
        return (
          transaction.equipment.owner.equals(userId) ||
          transaction.client.equals(userId)
        );
      })
      .reduce((acc, curr) => {
        return [curr._id, ...acc];
      }, []);

    await Transaction.deleteMany({
      _id: userTransactions,
    });

    res.status(200).json();
  } catch (error) {
    next(error);
  }
});
