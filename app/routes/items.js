var express = require("express");
var router = express.Router();
const constants = require("../constants/constants");

const controllerName = "items";
const MainModel = require(__path_models + controllerName);

const productVariantModel = require(__path_models + "productVariant");
// const productDetailModel = require(__path_models + "productDetail");
const VariantValueModel = require(__path_models + "variantValue");
const CommentModel = require(__path_models + "comment");

// const default_sort_field = "createAt";
// const default_sort_type = "desc";

// get all
router.get("/", async (req, res, next) => {
  try {
    let params = {};
    params.keyword = req.query.keyword;
    // params.sortType = default_sort_type;
    // params.size = req.query.size;
    // params.color = req.query.color;
    params.page = req.query.page;
    params.limit = req.query.limit;
    params.categoryId = req.body.categoryId;

    let listProductId = [];

    let listVariantFind = [];

    if (req.query.color) listVariantFind.push(+req.query.color);
    if (req.query.size) listVariantFind.push(+req.query.size);
    if (req.query.material) listVariantFind.push(+req.query.material);

    let productVariantItems = await productVariantModel.listItemsByValues(
      listVariantFind
    );

    for (let i = 0; i < productVariantItems.length; i++) {
      listProductId.push(productVariantItems[i].product_id);
    }

    const dataItemByName = await MainModel.findByName(params.keyword);
    const dataItemByCategory = await MainModel.findByCategoryId(
      params.categoryId
    );

    const getIdProduct = (listItems) => {
      let result = [];
      let finalList = [];
      listItems.forEach((item) => {
        result.push(item.id);
      });
      if (listProductId.length) {
        for (let i = 0; i < result.length; i++) {
          for (let j = 0; j < listProductId.length; j++) {
            if (result[i] === listProductId[j]) {
              finalList.push(result[i]);
            }
          }
        }
      } else {
        listProductId = result;
      }
      listProductId = finalList;
    };
    getIdProduct(dataItemByName);
    getIdProduct(dataItemByCategory);
    listProductId = Array.from(new Set(listProductId));

    if (
      (req.query.color ||
        req.query.size ||
        req.body.categoryId ||
        req.body.keyword) &&
      listProductId.length < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Don't find any product",
      });
    }
    const dataItemList = await MainModel.listItems(
      params,
      { task: "all" },
      listProductId
    );

    productVariantItems = await productVariantModel.findByProductId(
      listProductId
    );

    const newData = JSON.parse(JSON.stringify(dataItemList));

    for (let i = 0; i < newData.length; i++) {
      let productVariants = [];
      let variantValue = [];
      let color = {
        key: "color",
        value: [],
      };
      let size = { key: "size", value: [] };
      let material = { key: "material", value: [] };
      newData[i] = { ...newData[i], option: [] };
      productVariantItems.forEach((element) => {
        if (element.product_id === newData[i].id) {
          productVariants.push(element);
          variantValue = [...variantValue, ...element.values];
        }
      });
      variantValue = Array.from(new Set(variantValue));
      let variantValueList = await VariantValueModel.listItems(variantValue);
      variantValueList.forEach((element) => {
        if (element.variant_id === 1) {
          color.value.push({
            id: element.id,
            value: element.value,
          });
        } else if (element.variant_id === 3) {
          material.value.push({
            id: element.id,
            value: element.value,
          });
        } else {
          size.value.push({
            id: element.id,
            value: element.value,
          });
        }
      });
      if (color.value.length) newData[i].option.push(color);
      if (size.value.length) newData[i].option.push(size);
      if (material.value.length) newData[i].option.push(material);
      newData[i].variants = productVariants;
    }
    res.status(200).json({
      success: true,
      data: {
        newData,
        total: params.limit,
        page: params.page,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
});

// get one
router.get("/:id", async (req, res, next) => {
  try {
    let productVariantItems = await productVariantModel.listItems();

    const data = await MainModel.listItems(
      { id: +req.params.id },
      { task: "one" }
    );
    const newData = JSON.parse(JSON.stringify(data));
    let comment = await CommentModel.findCommentByProduct(newData[0]._id);
    
    if (!newData.length) {
      return res.status(400).json({
        success: false,
        message: "Not found product",
      });
    }

    let productVariants = [];
    let variantValue = [];
    let color = {
      key: "color",
      value: [],
    };
    let material = { key: "material", value: [] };
    let size = { key: "size", value: [] };

    newData[0] = { ...newData[0], option: [] };
    productVariantItems.forEach((element) => {
      if (element.product_id === newData[0].id) {
        productVariants.push(element);
        variantValue = [...variantValue, ...element.values];
      }
    });
    variantValue = Array.from(new Set(variantValue));
    let variantValueList = await VariantValueModel.listItems(variantValue);
    variantValueList.forEach((element) => {
      if (element.variant_id === 1) {
        color.value.push({
          id: element.id,
          value: element.value,
        });
      } else if (element.variant_id === 3) {
        material.value.push({
          id: element.id,
          value: element.value,
        });
      } else {
        size.value.push({
          id: element.id,
          value: element.value,
        });
      }
    });
    if (color.value.length) newData[0].option.push(color);
    if (size.value.length) newData[0].option.push(size);
    if (material.value.length) newData[0].option.push(material);
    if (comment) {
      newData[0].comment = comment;
    }
    newData[0].variants = productVariants;

    res.status(200).json({
      success: true,
      data: newData[0],
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
});

// add item
router.post("/add", async (req, res, next) => {
  try {
    let params = {
      name: req.body.name,
      image: req.body.image,
      images: req.body.images,
      description: req.body.description,
      price: req.body.price,
      salePrice: req.body.salePrice,
      quantity: req.body.quantity,
      sold: 0,
      createAt: constants.getTime(),
    };
    let allVariants = JSON.parse(JSON.stringify(req.body.variants));
    const dataProduct = await MainModel.create(params);
    await productVariantModel.create(allVariants, dataProduct.id);
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
    let body = req.body;
    await MainModel.editItem(
      { id: req.params.id, body: body },
      { task: "edit" }
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

router.delete("/delete/:id", async (req, res, next) => {
  try {
    await MainModel.deleteItem({ id: req.params.id }, { task: "one" });

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
