const mongoose = require("mongoose");
const databaseConfig = require(__path_configs + "database");

var schema = new mongoose.Schema({
  id: Number,
  product_id: Number,
  name: String,
  values: Array,
  quantity: Number,
  sku: String,
  price: Number,
  salePrice: Number,
  createAt: String,
});

module.exports = mongoose.model(databaseConfig.col_product_variant, schema);
