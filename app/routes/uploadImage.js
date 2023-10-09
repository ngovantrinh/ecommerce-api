var express = require("express");
const multer = require("multer");
var router = express.Router();

const controllerName = "upload";
const MainModel = require(__path_models + controllerName);

const Storage = multer.diskStorage({
  destination: "public/uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: Storage,
}).single("uploadImage");

router.post("/", (req, res, next) => {
  upload(req, res, async (err) => {

    if (err) {
      console.log(err);
    } else {
      await MainModel.create({
        image: {
          data: req.file.filename,
          contentType: req.file.mimetype,
        },
      });

      res.status(201).json({
        success: true,
        url: req.file.destination + '/' + req.file.originalname,
      });
    }
  });
});

module.exports = router;
