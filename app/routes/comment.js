var express = require("express");
var router = express.Router();
const constants = require("../constants/constants");

const jwt = require('jsonwebtoken')
const controllerName = "comment";
const MainModel = require(__path_models + controllerName);
const productModal = require(__path_schemas + "items");

router.post("/add/:productId", async (req, res, next) => {
  try {
    let { productId } = req.params;
    const productItem = await productModal.findOne({ _id: productId });
    let dataJwt = null;
    if (!productItem) {
      return res.status(401).json({
        success: false,
        message: "Product doesn't exist",
      });
    }
    if (constants.extractToken(req)) {
      dataJwt = await jwt.verify(
        constants.extractToken(req),
        process.env.JWT_SECRET
      );
    }

    if (!dataJwt) {
      return res.status(400).json({
        success: false,
        message: "Hey you must login before commenting",
      });
    }

    let comment = {
      userId: dataJwt.id,
      content: req.body.content,
      productId: req.params.productId,
    };
    await MainModel.create(comment);
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }

  next();
});

// router.get("/:productId", async (req, res, next) => {
//   try {
//     const productItem = await product.findOne({ id: req.params.productId });
//     if (!productItem) {
//       return res.status(401).json({
//         success: false,
//         message: "Product doesn't exist",
//       });
//     }

//     let comment = {
//       id: makeId(),
//       userId: req.body.userId,
//       content: req.body.content,
//       productId: req.params.productId,
//     };
//     await MainModel.create(comment);
//     res.status(200).json({
//       success: true,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//     });
//   }

//   next();
// });

module.exports = router;

makeId = (number) => {
  let text = "";
  let possible = "ABCDEGHIJKLMNOPQRSTUVWXYZ0123456789";

  for (let i = 0; i < number; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
