const Equipment = require("../models/Equipment.model");
const router = require("express").Router();
const isAuthenticated = require("../middlewares/auth.middlewares");

// POST "/api/equipment" => Crear equipment en la DB
router.post("/", isAuthenticated, async (req, res, next) => {
  const { name, pricePerDay, deposit, description, img } = req.body;
  const { _id } = req.payload;

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
      owner: _id,
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

// PATCH "/api/equipment/:equId" => Actualizar equipment en la DB por su id
router.patch("/:equId", isAuthenticated, async (req, res, next) => {
  const { equId } = req.params;
  const { owner, name, pricePerDay, deposit, description, img, isAvailable } =
    req.body;

  try {
    await Equipment.findByIdAndUpdate(equId, {
      owner,
      name,
      pricePerDay,
      deposit,
      description,
      img,
      isAvailable,
    });

    res.status(200).json();
  } catch (error) {
    next(error);
  }
});

// DELETE "/api/equipment/:equId" => Eliminar equipment en la DB por su id

router.delete("/:equId", isAuthenticated, async (req, res, next) => {
  const { equId } = req.params;

  try {
    await Equipment.findByIdAndDelete(equId);
    res.status(200).json();
  } catch (error) {
    next(error);
  }
});
