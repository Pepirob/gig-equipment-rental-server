const router = require("express").Router();
const uploader = require("../middlewares/cloudinary.middlewares");

// POST "/api/upload/equipmentImg" => Subir imagen de equipment a Cloudinary
router.post("/equipmentImg", uploader.single("image"), (req, res, next) => {
  console.log("file is: ", req.file);

  if (!req.file) {
    next("No file uploaded!");
    return;
  }

  res.json({ equipmentImgUrl: req.file.path });
});

// POST "/api/upload/userImg" => Subir imagen de user a Cloudinary
router.post("/userImg", uploader.single("image"), (req, res, next) => {
  console.log("file is: ", req.file);

  if (!req.file) {
    next("No file uploaded!");
    return;
  }

  res.json({ userImgUrl: req.file.path });
});

module.exports = router;
