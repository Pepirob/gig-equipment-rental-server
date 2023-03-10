const Equipment = require("../models/Equipment.model");
const router = require("express").Router();

router.post("/", async (req, res, next) => {
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

    const response = await Equipment.create({
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
