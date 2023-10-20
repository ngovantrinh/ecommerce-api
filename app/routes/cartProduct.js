var express = require("express");
var router = express.Router();
const constants = require("../constants/constants");

const controllerName = "cartProduct";
const MainModel = require(__path_models + controllerName);
const productVariantModel = require(__path_models + "productVariant");
const cartModel = require(__path_models + "cart");
const Users = require(__path_schemas + "users");

// router.post("/add", async (req, res, next) => {
//   try {
//     const { variantId, quantity } = req.body;
//     let productVariant = await productVariantModel.findOneItem(variantId);
//     if (productVariant[0].quantity < quantity) {
//       res.status(400).json({
//         success: false,
//         message: "Not enough stock",
//       });
//     }
//     let cart = await cartModel.getCart()
//     console.log(cart);
//     // let dataCart = await MainModel.getCart();
//     // let data = {
//     //   variantId: productVariant[0].id,
//     //   quantity: quantity,
//     // };
//     // if (dataCart.length) {
//     //   await MainModel.createCart(data);
//     // } else {
//     //   data.cartId = 1;
//     //   await MainModel.createCart(data);
//     // }

//     res.status(200).json({
//       success: true,
//       message: "Add item success",
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//     });
//   }
// });

module.exports = router;
