var express = require("express");
var router = express.Router();
const constants = require("../constants/constants");

const controllerName = "cart";
const MainModel = require(__path_models + controllerName);
const cartProductModel = require(__path_models + "cartProduct");
const productVariantModel = require(__path_models + "productVariant");
const ProductModel = require(__path_models + "items");
const VariantValueModel = require(__path_models + "variantValue");
// const Users = require(__path_schemas + "users");

router.post("/createCart", async (req, res, next) => {
  try {
    let data = {
      userId: null,
      status: 0,
    };
    await MainModel.create(data);
    let cart = await MainModel.findNewCart();
    res.status(200).json({
      success: true,
      cartId: cart[0]._id,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
});

router.post("/add", async (req, res, next) => {
  try {
    const { cartId, variantId, quantity } = req.body;
    let productVariant = await productVariantModel.findOneItem(variantId);
    if (!cartId || !variantId || !quantity) {
      res.status(400).json({
        success: false,
        cartId: 'something wrong',
      });
    }
    if (productVariant[0].quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock",
      });
    }
    let cart = await MainModel.getCart(cartId);
    if (!cart) {
      let data = {
        userId: null,
        status: 0,
      };

      await MainModel.create(data);
      let dataCart = await MainModel.findNewCart();
      let dataProductCart = {
        cartId: dataCart._id,
        variantId: productVariant[0].id,
        quantity: quantity,
      };
      await cartProductModel.createCart(dataProductCart);
      res.status(200).json({
        success: true,
        message: "Add item success",
      });
    } else {
      let dataCart = await MainModel.getCart(cartId);
      let dataProductCart = {
        cartId: dataCart._id,
        variantId: productVariant[0].id,
        quantity: quantity,
      };
      await cartProductModel.createCart(dataProductCart);
      res.status(200).json({
        success: true,
        message: "Add item success",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
});

router.get("/getCart", async (req, res, next) => {
  try {
    const { cartId } = req.body;

    let resData = {
      idCart: 0,
      totalPreSale: 0,
      totalSale: 0,
      cart: [],
    };
    let totalPreSale = 0;
    let totalSale = 0;

    if (!cartId || cartId == "") {
      return res.status(400).json({
        success: false,
        message: "Not have any product in your cart",
      });
    }

    const cart = await MainModel.getCart(cartId);
    const listProductCart = await cartProductModel.getCartProduct(cart._id);
    resData.idCart = cart._id;
    let listIdProductVariant = [];
    listProductCart.forEach((element) => {
      listIdProductVariant.push(element.variantId);
    });

    const listProduct = await productVariantModel.listItems(
      listIdProductVariant
    );
    for (let i = 0; i < listProduct.length; i++) {
      const itemProduct = await ProductModel.listItems(
        { id: +listProduct[i].product_id },
        { task: "one" }
      );
      let dataVariant = await VariantValueModel.getListValues(
        listProduct[i].values
      );
      dataVariant = dataVariant.map((item) => {
        let result = {
          key: "",
          value: "",
        };
        if (item.variant_id === 1) {
          result.key = "color";
          result.value = item.value;
        } else if (item.variant_id === 2) {
          result.key = "size";
          result.value = item.value;
        } else {
          result.key = "material";
          result.value = item.value;
        }
        return result;
      });
      listProductCart.forEach((item) => {
        if (item.variantId === listProduct[i].id) {
          let result = {
            name: listProduct[i].name,
            image: itemProduct[0].image,
            quantity: listProduct[i].quantity,
            quantityBy: item.quantity,
            price: listProduct[i].price,
            salePrice: listProduct[i].salePrice,
            optionChoose: dataVariant,
          };
          totalPreSale += listProduct[i].price;
          totalSale += listProduct[i].salePrice;
          resData.cart.push(result);
        }
      });
    }
    resData.totalPreSale = totalPreSale;
    resData.totalSale = totalSale;

    res.status(200).json({
      success: true,
      data: resData,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
});

router.put("/edit", async (req, res, next) => {
  try {
    const { id, quantity } = req.body;
    let productVariantItem = await cartProductModel.getCartProductById(id);
    let productVariant = await productVariantModel.findOneItem(
      productVariantItem[0].variantId
    );
    if (productVariant[0].quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock",
      });
    }
    await cartProductModel.editItem(req.body);
    res.status(200).json({
      success: true,
      message: "Update cart success",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Update cart wrong",
    });
  }
});

// router.put("/edit", async (req, res, next) => {
//   try {
//     const { id, quantity } = req.body;
//     let productVariantItem = await cartProductModel.getCartProductById(id);
//     let productVariant = await productVariantModel.findOneItem(
//       productVariantItem[0].variantId
//     );
//     if (productVariant[0].quantity < quantity) {
//       return res.status(400).json({
//         success: false,
//         message: "Not enough stock",
//       });
//     }
//     await cartProductModel.editItem(req.body);
//     res.status(200).json({
//       success: true,
//       message: "Update cart success",
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: "Update cart wrong",
//     });
//   }
// });

router.delete("/deleteCartProduct/:id", async (req, res, next) => {
  try {
    await cartProductModel.deleteItem({ id: req.params.id });

    res.status(200).json({
      success: true,
      message: "Remove item from cart success",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Can't remove",
    });
  }
});

module.exports = router;
