var express = require("express");
var router = express.Router();

router.use("/items", require("./items"));
router.use("/", require("./users"));
router.use("/upload", require('./uploadImage'));

module.exports = router;
