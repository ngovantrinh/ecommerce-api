var express = require("express");
var router = express.Router();
const constants = require("../constants/constants");

const controllerName = "variants";
const MainModel = require(__path_models + controllerName);


router.get("/product/:productId", async (req, res, next) => {
  try {
    const data = await MainModel.listItems(
      { productId: req.params.productId },
      { task: "product" }
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
router.get("/:id", async (req, res, next) => {
  try {
    const data = await MainModel.listItems(
      { id: req.params.id },
      { task: "id" }
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
    let variant = {
      id: makeId(8),
      productId: req.body.productId || "",
      variantName: req.body.variantName || "",
      variantDescription: req.body.variantDescription || "",
      priceProduct: req.body.priceProduct || "",
      available: req.body.available || "",
      sold: req.body.sold || "",
      createAt: constants.getTime(),
    };

    await MainModel.create(variant);

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

// router.put("/edit/:id", async (req, res, next) => {
//   try {
//     let body = req.body;
//     const data = await MainModel.editItem(
//       { id: req.params.id, body: body },
//       { task: "edit" }
//     );

//     res.status(200).json({
//       success: true,
//       data: data,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//     });
//   }
// });

// router.delete("/delete", async (req, res, next) => {
//   try {
//     const data = await MainModel.deleteItem(
//       { id: req.params.id },
//       { task: "one" }
//     );

//     res.status(200).json({
//       success: true,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//     });
//   }
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
