var express = require("express");
var router = express.Router();
const constants = require("../constants/constants");
const jwt = require("jsonwebtoken");
const cart = require("../models/cart");

const controllerName = "cart";
const MainModel = require(__path_models + controllerName);
const cartProductModel = require(__path_models + "cartProduct");
const productSoldModel = require(__path_models + "productSold");
const productVariantModel = require(__path_models + "productVariant");
const ProductModel = require(__path_models + "items");
const VariantValueModel = require(__path_models + "variantValue");
const UserModal = require(__path_schemas + "users");

router.post("/createCart", async (req, res, next) => {
  try {
    let data = {
      userId: "",
      status: 0,
      orderPrice: 0,
      createAt: constants.getTime(),
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

    let productVariantItem = await cartProductModel.getCartProductByProductId(
      variantId,
      cartId
    );
    if (!cartId || !variantId || !quantity) {
      res.status(400).json({
        success: false,
        cartId: "something wrong",
      });
    }
    if (productVariant[0].quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock",
      });
    }

    if (productVariantItem.length !== 0) {
      return res.status(400).json({
        success: false,
        message: "Item already exists",
      });
    }

    let cart = await MainModel.getCart(cartId);

    if (!cart) {
      let data = {
        userId: "",
        status: 0,
        orderPrice: 0,
        createAt: constants.getTime(),
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
      if (cart.status !== 0) {
        return res.status(400).json({
          success: false,
          message: "Can't find your cart",
        });
      }
      let dataProductCart = {
        cartId: cart._id,
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

// get cart by userId and role
router.get("/all", async (req, res, next) => {
  try {
    let dataJwt = null;
    let carts = null;
    let listCarts = [];

    if (constants.extractToken(req)) {
      dataJwt = await jwt.verify(
        constants.extractToken(req),
        process.env.JWT_SECRET
      );
    }

    if (!dataJwt) {
      return res.status(400).json({
        success: false,
        message: "You must login first",
      });
    }

    // check role user and get carts
    if (dataJwt.role === 1) {
      carts = await MainModel.showAllUserCarts(dataJwt);
    } else {
      // if role !== 1 return all carts
      carts = await MainModel.getCarts();
    }

    if (!carts.length) {
      return res.status(400).json({
        success: false,
        message: "You don't have any cart",
      });
    }

    for (let i = 0; i < carts.length; i++) {
      let resData = {
        idCart: 0,
        orderPrice: 0,
        userId: "",
        status: 0,
        createAt: "",
        cart: [],
      };
      let totalPreSale = 0;
      let totalSale = 0;
      const listProductCart = await cartProductModel.getCartProduct(
        carts[i]._id
      );

      resData.idCart = carts[i]._id;
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
              id: item.id,
              name: listProduct[i].name,
              image: itemProduct[0].image,
              quantity: listProduct[i].quantity,
              quantityBuy: item.quantity,
              price: listProduct[i].price,
              salePrice: listProduct[i].salePrice,
              optionChoose: dataVariant,
            };
            totalPreSale += listProduct[i].price * item.quantity;
            totalSale += listProduct[i].salePrice * item.quantity;
            resData.cart.push(result);
          }
        });
      }
      resData.status = carts[i].status;
      resData.userId = carts[i].userId;
      resData.createAt = carts[i].createAt;
      resData.orderPrice = carts[i].orderPrice;
      listCarts = [...listCarts, resData];
    }

    if (!listCarts.length) {
      return res.status(400).json({
        success: false,
        message: "No cart",
      });
    }

    return res.status(200).json({
      success: true,
      data: listCarts,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
});

// get cart pendding
router.get("/getCart", async (req, res, next) => {
  try {
    const { cartId } = req.query;
    let resData = {
      idCart: 0,
      totalPreSale: 0,
      totalSale: 0,
      userId: "",
      cart: [],
    };
    let totalPreSale = 0;
    let totalSale = 0;

    if ((!cartId || cartId == "") && !constants.extractToken(req)) {
      return res.status(400).json({
        success: false,
        message: "Not have any product in your cart",
      });
    }
    let dataJwt = null;
    let cart = null;

    if (constants.extractToken(req)) {
      dataJwt = await jwt.verify(
        constants.extractToken(req),
        process.env.JWT_SECRET
      );
    }

    let cartByUserId = await MainModel.getCartByUserId(dataJwt);
    let cartByCartId = await MainModel.getCart(cartId);

    if (cartByUserId) cart = cartByUserId;
    if (cartByCartId) cart = cartByCartId;

    if (!cart) {
      return res.status(400).json({
        success: false,
        message: "Cart doesn't exist",
      });
    }
    if (cart.status !== 0) {
      return res.status(400).json({
        success: false,
        message: "Can't find your cart",
      });
    }
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
            id: item.id,
            name: listProduct[i].name,
            image: itemProduct[0].image,
            quantity: listProduct[i].quantity,
            quantityBuy: item.quantity,
            price: listProduct[i].price,
            salePrice: listProduct[i].salePrice,
            optionChoose: dataVariant,
          };
          totalPreSale += listProduct[i].price * item.quantity;
          totalSale += listProduct[i].salePrice * item.quantity;
          resData.cart.push(result);
        }
      });
    }
    resData.userId = cart.userId;
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

router.get("/getListOrder", async (req, res, next) => {
  try {
    let params = {};
    params.page = req.query.page;
    params.limit = req.query.limit;

    if (constants.extractToken(req) === null)
      return res.status(404).json({
        success: false,
        message: "Don't have token",
      });
    let dataJwt = await jwt.verify(
      constants.extractToken(req),
      process.env.JWT_SECRET
    );
    let listCart = null;
    if (dataJwt.role === 1) {
      listCart = await MainModel.getListCartOrder(params, dataJwt.id);
    }
    if (listCart.length) {
      let finalData = [];
      for (let i = 0; i < listCart.length; i++) {
        let resData = {
          idCart: listCart[i]._id,
          orderPrice: listCart[i].orderPrice,
          cart: [],
        };
        const listProductCart = await cartProductModel.getCartProduct(
          listCart[i]._id
        );
        resData.idCart = listCart[i]._id;
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
                id: item.id,
                name: listProduct[i].name,
                image: itemProduct[0].image,
                quantity: listProduct[i].quantity,
                quantityBuy: item.quantity,
                price: listProduct[i].price,
                salePrice: listProduct[i].salePrice,
                optionChoose: dataVariant,
              };
              resData.cart.push(result);
            }
          });
        }
        finalData.push(resData);
      }
      return res.status(200).json({
        success: true,
        page: params.page,
        limit: params.limit,
        listOrder: finalData,
      });
    }
    return res.status(400).json({
      success: false,
      message: "You don't have any order",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
});

// thanh toán
router.put("/paymentOrders", async (req, res, next) => {
  try {
    const { cartId, orderPrice, quantity } = req.body;
    let dataUpdate = {
      orderPrice: orderPrice,
      status: constants.STATUS_PAYMENTR,
    };
    const productSold = await productSoldModel.findItem();
    await MainModel.editCart(cartId, dataUpdate);
    await productSoldModel.editQuantity(productSold[0],quantity);
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something wrong",
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

router.put("/status/change", async (req, res, next) => {
  try {
    const { cartId, status } = req.body;
    await MainModel.editCart(cartId, { status });
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

router.get("/revenue", async (req, res, next) => {
  try {
    // let dataJwt = await jwt.verify(
    //   constants.extractToken(req),
    //   process.env.JWT_SECRET
    // );
    let finalListCarts = [];
    let carts = [];
    let listCart = await MainModel.getUserCart();
    let totalRevenue = 0;
    if (req.query.month && req.query.year) {
      listCart.forEach((item) => {
        let time = item.createAt.split(" ")[0];
        time = time.split("-").reverse().join("-");

        let month = new Date(time);
        let year = new Date(time);
        if (
          month.getMonth() + 1 === +req.query.month &&
          year.getFullYear() === +req.query.year
        ) {
          carts.push(item);
        }
      });
    } else if (req.query.year) {
      listCart.forEach((item) => {
        let time = item.createAt.split(" ")[0];
        time = time.split("-").reverse().join("-");

        let year = new Date(time);
        if (year.getFullYear() === +req.query.year) {
          carts.push(item);
        }
      });
    }

    carts.forEach((item) => {
      totalRevenue += item.orderPrice;
    });

    for (let i = 0; i < carts.length; i++) {
      let resData = {
        idCart: 0,
        totalPreSale: 0,
        totalSale: 0,
        userId: "",
        status: 0,
        createAt: "",
        cart: [],
      };
      let totalPreSale = 0;
      let totalSale = 0;
      const listProductCart = await cartProductModel.getCartProduct(
        carts[i]._id
      );

      resData.idCart = carts[i]._id;
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
              id: item.id,
              name: listProduct[i].name,
              image: itemProduct[0].image,
              quantity: listProduct[i].quantity,
              quantityBuy: item.quantity,
              price: listProduct[i].price,
              salePrice: listProduct[i].salePrice,
              optionChoose: dataVariant,
            };
            totalPreSale += listProduct[i].price * item.quantity;
            totalSale += listProduct[i].salePrice * item.quantity;
            resData.cart.push(result);
          }
        });
      }

      resData.status = carts[i].status;
      resData.userId = carts[i].userId;
      resData.createAt = carts[i].createAt;
      resData.totalPreSale = totalPreSale;
      resData.totalSale = totalSale;
      finalListCarts = [...finalListCarts, resData];
    }

    return res.status(200).json({
      success: true,
      listCart: finalListCarts,
      total: totalRevenue,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
    });
  }
});

router.put("/addUserToCart", async (req, res, next) => {
  try {
    if (constants.extractToken(req) === null)
      return res.status(404).json({
        success: false,
        message: "Don't have token",
      });
    let dataJwt = await jwt.verify(
      constants.extractToken(req),
      process.env.JWT_SECRET
    );
    const userInfo = await UserModal.findOne({ username: dataJwt.username });
    if (!userInfo) {
      return res.status(401).json({
        success: false,
        message: "User doesn't exist",
      });
    }
    await MainModel.editCart(req.body.cartId, { userId: dataJwt.id });
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
