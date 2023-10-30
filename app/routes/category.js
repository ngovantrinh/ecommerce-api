var express = require("express");
var router = express.Router();
const constants = require("../constants/constants");

const controllerName = "category";
const MainModel = require(__path_models + controllerName);

router.post("/add", async (req, res, next) => {
  try {
    const data = await MainModel.getItemByName(req.body.name);
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

router.get("", async (req, res, next) => {
  try {
    const data = await MainModel.getListItems();
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

router.delete("/:id", async (req, res, next) => {
  try {
    const category = await MainModel.getItem(req.params.id);
    if (!category) {
      return res.status(400).json({
        success: false,
      });
    }
    await MainModel.deleteItem(req.params);
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
});

router.put("/edit/:id", async (req, res, next) => {
  try {
    const category = await MainModel.getItem(req.params.id);
    if (!category) {
      return res.status(400).json({
        success: false,
      });
    }
    await MainModel.editItem(req.params, req.body);
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
