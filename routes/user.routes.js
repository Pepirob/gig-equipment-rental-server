const User = require("../models/User.model");
const Transaction = require("../models/Transaction.model");
const router = require("express").Router();
const isAuthenticated = require("../middlewares/auth.middlewares");

// GET “/api/user/:userId” => Enviar info de un usuario por su Id

router.get("/:userId", isAuthenticated, async (req, res, next) => {
  try {
    const response = await User.findById(req.params.userId);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// PATCH “/api/user/:userId” => Editar un usuario por su Id

router.patch("/:userId", isAuthenticated, async (req, res, next) => {
  const { userId } = req.params;
  const activeUserId = req.payload._id;
  const patchedFields = Object.keys(req.body);

  if (patchedFields.some((field) => !req.body[field])) {
    res.status(400).json({ errorMessage: "Fields must be filled" });
    return;
  }

  if (userId !== activeUserId) {
    res.status(403).json("Users cannot edit other users");
    return;
  }

  const { email, username, location, phoneNumber, wishlist, img, creditCard } =
    req.body;

  try {
    const foundUserByName = await User.findOne({ username });

    if (foundUserByName) {
      res.status(400).json({
        errorMessage: "User with username already exists",
      });
      return;
    }

    await User.findByIdAndUpdate(userId, {
      email,
      username,
      location,
      phoneNumber,
      wishlist,
      img,
      creditCard,
    });

    res.status(201).json();
  } catch (error) {
    next(error);
  }
});

// DELETE   “/api/user/userId” => Eliminar a un usuario por su Id

router.delete("/:userId", isAuthenticated, async (req, res, next) => {
  const { userId } = req.params;
  const activeUserId = req.payload._id;

  if (userId !== activeUserId) {
    res.status(403).json("Users cannot delete other users");
    return;
  }

  try {
    const pendingTransactions = await Transaction.find({
      state: { $nin: ["incomplete", "returned"] },
    })
      .select({ equipment: 1, client: 1 })
      .populate("equipment", "owner");
    if (
      pendingTransactions &&
      pendingTransactions.some(
        (transaction) =>
          transaction.equipment.owner.equals(activeUserId) ||
          transaction.client._id.equals(activeUserId)
      )
    ) {
      res
        .status(403)
        .json("Users with pending transactions cannot delete their accounts");

      return;
    } else {
      await User.findByIdAndDelete(userId);

      res.status(200).json();
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
