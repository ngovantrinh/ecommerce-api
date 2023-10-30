var express = require("express");
var router = express.Router();
const constants = require("../constants/constants");

const controllerName = "cupon";
const MainModel = require(__path_models + controllerName);

router.get("/cupon_type", async (req, res, next) => {
  try {
    const data = await MainModel.getCupon();
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
});

router.post("/add", async (req, res, next) => {
  try {
    const data = await MainModel.findOneItem(req.body.name);
    if (data) {
      return res.status(400).json({
        success: false,
        message: "Item already exists",
      });
    }
    await MainModel.create(req.body);
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
});

router.post("/check", async (req, res, next) => {
  try {
    console.log(req.body.cuponCode);
    const data = await MainModel.findByCode(req.body.cuponCode);
    if (!data) {
      return res.status(400).json({
        success: false,
        message: "Item already exists",
      });
    }
    res.status(200).json({
      success: true,
      value: data.value,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
});

module.exports = router;
