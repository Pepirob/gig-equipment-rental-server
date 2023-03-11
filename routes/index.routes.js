const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const authRouter = require("./auth.routes");
router.use("/auth", authRouter);

const userRouter = require("./user.routes");
router.use("/user", userRouter);

const equipmentRouter = require("./equipment.routes");
router.use("/equipment", equipmentRouter);

const uploadRouter = require("./upload.routes");
router.use("/upload", uploadRouter);

module.exports = router;
