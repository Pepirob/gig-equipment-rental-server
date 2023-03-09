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

  if (password.length < 9 || password.length > 15) {
    res.status(400).json({
      errorMessage:
        "Password must contain at least 9 characters and no more than 15",
    });
    return;
  }

  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{9,}$/;

  if (!passwordRegex.test(password)) {
    res.status(400).json({
      errorMessage:
        "Must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number",
    });
    return;
  }

  const emailRegex =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

  if (!emailRegex.test(email)) {
    res.status(400).json({
      errorMessage: "E-mail must meet the correct format i",
    });
    return;
  }

  const phoneNumberRegex = /^\+[1-9]\d{1,14}$/g;

  if (!phoneNumberRegex.test(phoneNumber)) {
    res.status(400).json({
      errorMessage: "Phone number must meet the correct format",
    });
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
