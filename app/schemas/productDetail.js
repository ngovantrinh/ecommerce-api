const mongoose = require("mongoose");
const databaseConfig = require(__path_configs + "database");

var schema = new mongoose.Schema({
  id: Number,
  product_variant_id: Number,
  variant_value_id: Number,
  createAt: String,
});

module.exports = mongoose.model(databaseConfig.col_product_detail, schema);
