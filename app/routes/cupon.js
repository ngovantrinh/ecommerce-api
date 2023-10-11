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



module.exports = router;

makeId = (number) => {
  let text = "";
  let possible = "ABCDEGHIJKLMNOPQRSTUVWXYZ0123456789";

  for (let i = 0; i < number; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
