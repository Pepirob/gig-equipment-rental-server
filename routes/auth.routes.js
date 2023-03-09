const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const router = require("express").Router();

// POST "/api/auth/signup" => Crear usuario en la DB
router.post("/signup", async (req, res, next) => {
  const { email, username, location, password, phoneNumber } = req.body;

  if (!email || !username || !location || !password || !phoneNumber) {
    res.status(400).json({ errorMessage: "Fields must be filled" });
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    await User.create({
      email,
      username,
      location,
      password: hashPassword,
      phoneNumber,
    });

    res.status(201).json();
  } catch (error) {
    next(error);
  }
});

// POST "/api/auth/login" => Crear sesion en la DB

// GET "/api/auth/verify" => Verificar usuario activo

module.exports = router;
