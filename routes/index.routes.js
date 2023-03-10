const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const authRouter = require("./auth.routes");
router.use("/auth", authRouter);

const equipmentRouter = require("./equipment.routes");
router.use("/equipment", equipmentRouter);

module.exports = router;
