var express = require("express");
var router = express.Router();

router.use("/", require("./users"));
router.use("/items", require("./items"));
router.use("/item-detail", require("./productVariant"));
router.use("/variants", require("./variants"));
router.use("/comment", require("./comment"));
router.use("/upload", require('./uploadImage'));
router.use("/cupons", require('./cupon'));
router.use("/cartProduct", require('./cartProduct'));
router.use("/cart", require('./cart'));
router.use("/category", require('./category'));
router.use("/cart/sold", require('./productSold'));

module.exports = router;
