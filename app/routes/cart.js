var express = require("express");
var router = express.Router();
const constants = require("../constants/constants");

const controllerName = "cart";
const MainModel = require(__path_models + controllerName);
const cartProductModel = require(__path_models + "cartProduct");
const productVariantModel = require(__path_models + "productVariant");
// const Users = require(__path_schemas + "users");

router.post("/add", async (req, res, next) => {
  try {
    const { variantId, quantity } = req.body;
    let productVariant = await productVariantModel.findOneItem(variantId);
    if (productVariant[0].quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock",
      });
    }
    let cart = await MainModel.getCart();
    if (!cart.length) {
      let data = {
        userId: null,
        status: 0,
      };

      await MainModel.create(data);
      let dataCart = await MainModel.getCart();

      let dataProductCart = {
        cartId: dataCart[0].id,
        variantId: productVariant[0].id,
        quantity: quantity,
      };
      await cartProductModel.createCart(dataProductCart);
    } else {
      let dataCart = await MainModel.getCart();
      let dataProductCart = {
        cartId: dataCart[0].id,
        variantId: productVariant[0].id,
        quantity: quantity,
      };
      await cartProductModel.createCart(dataProductCart);
    }

    res.status(200).json({
      success: true,
      message: "Add item success",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
});

router.get("/getAllCart", async (req, res, next) => {
  try {
    await MainModel.getCart();
    res.status(200).json({
      success: true,
      message: "Add item success",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
});

module.exports = router;
