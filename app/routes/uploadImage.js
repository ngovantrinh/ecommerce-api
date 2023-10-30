var express = require("express");
const multer = require("multer");
var router = express.Router();
const fs = require("fs");
const path = require("path");

const controllerName = "upload";
const MainModel = require(__path_models + controllerName);

const uniqueSuffix = Date.now();
const Storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, uniqueSuffix + file.originalname);
  },
});
const upload = multer({
  storage: Storage,
}).single("uploadImage");

router.post("/", async (req, res, next) => {
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
        url: "/" + uniqueSuffix + req.file.originalname,
      });
    }
  });
});

router.get("/", async (req, res, next) => {
  try {
    let data = await MainModel.findItems();
    res.status(200).json({
      success: true,
      url: data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
});

module.exports = router;
