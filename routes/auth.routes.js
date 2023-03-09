const User = require("../models/User.model");

const router = require("express").Router();

// POST "/api/auth/signup" => Crear usuario en la DB
router.post("/signup", async (req, res, next) => {
  console.log(req.body);
  const { email, username, location, password, phoneNumber } = req.body;
  try {
    const response = await User.create({
      email,
      username,
      location,
      password,
      phoneNumber,
    });
    console.log(response);
    res.status(201).json();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// POST "/api/auth/login" => Crear sesion en la DB

// GET "/api/auth/verify" => Verificar usuario activo

module.exports = router;
