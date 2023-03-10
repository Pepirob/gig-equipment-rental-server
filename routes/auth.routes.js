const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const router = require("express").Router();
const jwt = require("jsonwebtoken");

const isAuthenticated = require("../middlewares/auth.middlewares");

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
      errorMessage: "E-mail must meet the correct format",
    });
    return;
  }

  const phoneNumberRegex = /^\+[1-9]\d{1,14}$/g;

  if (!phoneNumberRegex.test(phoneNumber)) {
    res.status(400).json({
      errorMessage: "Phone number must meet the correct format: +00000000000",
    });
    return;
  }

  try {
    const foundUserByName = await User.findOne({ username });

    if (foundUserByName) {
      res.status(400).json({
        errorMessage: "User with username already exists",
      });
      return;
    }

    const foundUserByEmail = await User.findOne({ email });

    if (foundUserByEmail) {
      res.status(400).json({
        errorMessage: "User with email already exists",
      });
      return;
    }

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
router.post("/login", async (req, res, next) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    res.status(400).json({ errorMessage: "Fields must be filled" });
    return;
  }

  try {
    const foundUser = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });
    const errorMessage = "Invalid credentials";

    if (!foundUser) {
      res.status(400).json({ errorMessage });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password
    );

    if (!isPasswordCorrect) {
      res.status(400).json({ errorMessage });
      return;
    }

    const payload = {
      _id: foundUser._id,
      email: foundUser.email,
      username: foundUser.username,
    };

    const tokenConfig = {
      algorithm: "HS256",
      expiresIn: "3d",
    };

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, tokenConfig);

    res.status(200).json({ authToken });
  } catch (error) {
    next(error);
  }
});

// GET "/api/auth/verify" => Verificar usuario activo
router.get("/verify", isAuthenticated, (req, res) => {
  res.status(200).json(req.payload);
});

module.exports = router;
