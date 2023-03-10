const Equipment = require("../models/Equipment.model");
const router = require("express").Router();
const isAuthenticated = require("../middlewares/auth.middlewares");

router.post("/", isAuthenticated, async (req, res, next) => {
  const { name, pricePerDay, deposit, description, img } = req.body;

  try {
    if (!name) {
      res.status(400).json({ errorMessage: "Equipment name must be filled" });
      return;
    }

    if (!pricePerDay) {
      res
        .status(400)
        .json({ errorMessage: "Equipment must have price per day amount" });
      return;
    }

    if (!deposit) {
      res
        .status(400)
        .json({ errorMessage: "Equipment must have deposit amount" });
      return;
    }

    if (description.length > 650) {
      res
        .status(400)
        .json({ errorMessage: "Description cannot exceed 650 characters" });
      return;
    }

    await Equipment.create({
      name,
      pricePerDay,
      deposit,
      description,
      img,
    });

    res.status(201).json();
  } catch (error) {
    next(error);
  }
});
module.exports = router;
