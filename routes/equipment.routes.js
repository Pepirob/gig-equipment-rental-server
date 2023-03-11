const Equipment = require("../models/Equipment.model");
const User = require("../models/User.model");
const router = require("express").Router();
const isAuthenticated = require("../middlewares/auth.middlewares");
const ObjectId = require("mongodb").ObjectId;
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

// GET "/api/equipment/available" => enviar lista de equipment disponible y ordenada por actualización
router.get("/available", async (req, res, next) => {
  const { location } = req.query;

  const locationRegex = new RegExp(location);

  if (location) {
    try {
      const locatedUsers = await User.find({
        location: { $regex: locationRegex },
      }).select({ _id: 1 });

      const usersIdArr = locatedUsers.map((user) => {
        return user._id;
      });

      const locatedEquipment = await Promise.all(
        usersIdArr.map(async (userId) => {
          return await Equipment.find({ owner: userId });
        })
      );

      const sortedEquipment = [...locatedEquipment]
        .reduce((a, b) => a.concat(b), [])
        .sort((a, b) => a.updatedAt - b.updatedAt);

      res.status(200).json(sortedEquipment);
    } catch (error) {
      next(error);
    }
  } else {
    try {
      const response = await Equipment.find({ isAvailable: true }).sort({
        updatedAt: -1,
      });

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
});

// GET "/api/equipment/wishlist" => enviar lista de deseos
router.get("/wishlist", async (req, res, next) => {
  try {
    const response = await User.find().select({ wishlist: 1 });
    res.status(200).json(response);
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
