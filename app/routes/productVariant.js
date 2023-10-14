var express = require("express");
var router = express.Router();
const constants = require("../constants/constants");

// const controllerName = "itemDetail";
// const MainModel = require(__path_models + controllerName);

const default_sort_field = "createAt";
const default_sort_type = "desc";

// router.get("/", async (req, res, next) => {
//   try {
//     let params = {};
//     params.keyword = req.query.keyword;
//     params.sortField = default_sort_field;
//     params.sortType = default_sort_type;

//     const dataItemList = await MainModel.listItems(params, { task: "all" });

//     res.status(200).json({
//       success: true,
//       data: dataItemList,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//     });
//   }
// });
// router.get("/:id", async (req, res, next) => {
//   try {
//     const data = await MainModel.listItems(
//       { id: req.params.id },
//       { task: "one" }
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

// router.post("/add", async (req, res, next) => {

//   try {
//     let params = {
//       id: makeId(8),
//       productId: req.body.productId,
//       productVariantName: req.body.productVariantName,
//       sku: req.body.sku,
//       price: req.body.price,
//       quantity: req.body.quantity,
//       createAt: constants.getTime(),
//     };

//     const data = await MainModel.create(params);

//     res.status(201).json({
//       success: true,
//       data: data,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//     });
//   }
// });

// router.put("/edit/:id", async (req, res, next) => {
//   try {
//     let body = req.body;
//     await MainModel.editItem(
//       { id: req.params.id, body: body },
//       { task: "edit" }
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

// router.delete("/delete/:id", async (req, res, next) => {
//   try {
//     await MainModel.deleteItem(
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
