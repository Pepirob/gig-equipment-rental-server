const User = require("../models/User.model");

const router = require("express").Router();

// GET “/api/user/:userId” => Enviar info de un usuario por su Id

router.get("/:userId", async (req, res, next) => {
  try {
    const response = await User.findById(req.params.userId);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// PATCH “/api/user/:userId” => Editar un usuario por su Id

router.patch("/:userId", async (req, res, next) => {
  const { email, username, location, phoneNumber, wishlist, img, creditCard } =
    req.body;

  try {
    await User.findByIdAndUpdate(req.params.userId, {
      email,
      username,
      location,
      phoneNumber,
      wishlist,
      img,
      creditCard,
    });

    res.status(200).json();
  } catch (error) {
    next(error);
  }
});

// DELETE   “/api/user/userId” => Eliminar a un usuario por su Id

router.delete("/:userId", async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
