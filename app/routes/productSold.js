var express = require("express");
var router = express.Router();
const constants = require("../constants/constants");

const controllerName = "productSold";
const MainModel = require(__path_models + controllerName);

router.get("/total", async (req, res, next) => {
  try {
    const productSold = await MainModel.findItem();

    res.status(200).json({
      success: true,
      data: {
        quantity: productSold[0].quantity,
        salesProfit: productSold[0].salesProfit,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
});

module.exports = router;
