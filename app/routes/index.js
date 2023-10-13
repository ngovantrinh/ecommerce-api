var express = require("express");
var router = express.Router();

router.use("/", require("./users"));
router.use("/items", require("./items"));
router.use("/item-detail", require("./itemDetail"));
router.use("/variants", require("./variants"));
router.use("/comment", require("./comment"));
router.use("/upload", require('./uploadImage'));
router.use("/cupons", require('./cupon'));

module.exports = router;
