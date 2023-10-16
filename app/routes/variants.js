var express = require("express");
var router = express.Router();
const constants = require("../constants/constants");

const controllerName = "variants";
const MainModel = require(__path_models + controllerName);
const VariantValueModel = require(__path_models + "variantValue");

router.get("/product", async (req, res, next) => {
  try {
    let finalData = [];
    const dataVariantName = await MainModel.listItems({}, { task: "all" });

    for (let i = 0; i < dataVariantName.length; i++) {
      let variantValueList = await VariantValueModel.getListByVariantId(dataVariantName[i].id);
      finalData.push({
        key: dataVariantName[i].variant,
        value: variantValueList
      })
    }

    res.status(200).json({
      success: true,
      data: finalData,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
});
router.get("/", async (req, res, next) => {
  try {
    const data = await MainModel.listItems({}, { task: "all" });

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
