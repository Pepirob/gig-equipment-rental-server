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

// DELETE   “/api/user/userId” => Eliminar a un usuario por su Id

module.exports = router;
