var express = require("express");
var router = express.Router();
const constants = require("../constants/constants");

const controllerName = "items";
const MainModel = require(__path_models + controllerName);
const VariantsModel = require(__path_models + "variants");

const default_sort_field = "createAt";
const default_sort_type = "desc";

router.get("/", async (req, res, next) => {
  try {
    let params = [];
    params.keyword = req.query.keyword;
    params.sortField = default_sort_field;
    params.sortType = default_sort_type;
    params.size = req.query.size.split(',');

    const variantsList = await VariantsModel.findItemBySize(params);
    const dataItemList = await MainModel.listItems(params, { task: "all" });
    let listVariant = [];
    let itemProductId = "";
    for (let i = 0; i < dataItemList.length; i++) {
      for (let j = 0; j < variantsList.length; j++) {
        if (
          dataItemList[i].id === variantsList[j].productId &&
          variantsList[j].productId !== itemProductId
        ) {
          listVariant.push(dataItemList[i]);
          itemProductId = variantsList[j].productId;
        }
      }
    }

    res.status(200).json({
      success: true,
      data: listVariant,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    const data = await MainModel.listItems(
      { id: req.params.id },
      { task: "one" }
    );

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
  // res.send('add item')

  try {
    let params = {
      id: makeId(8),
      name: req.body.name || "",
      status: req.body.status || "",
      img: req.body.img || "",
      price: req.body.price || "",
      salePrice: req.body.salePrice || "",
      description: req.body.description || "",
      available: req.body.available || "",
      sold: req.body.sold || "",
      createAt: constants.getTime(),
    };

    const data = await MainModel.create(params);

    res.status(201).json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
});

router.put("/edit/:id", async (req, res, next) => {
  try {
    let body = req.body;
    const data = await MainModel.editItem(
      { id: req.params.id, body: body },
      { task: "edit" }
    );

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

router.delete("/delete", async (req, res, next) => {
  try {
    const data = await MainModel.deleteItem(
      { id: req.params.id },
      { task: "one" }
    );

    res.status(200).json({
      success: true,
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
