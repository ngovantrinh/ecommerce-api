const mongoose = require("mongoose");
const databaseConfig = require(__path_configs + "database");

var schema = new mongoose.Schema({
  id: Number,
  cartId: String,
  variantId: Number,
  quantity: Number,
});

module.exports = mongoose.model(databaseConfig.col_cart_product, schema);
