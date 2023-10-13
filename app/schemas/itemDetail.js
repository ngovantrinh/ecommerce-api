const mongoose = require("mongoose");
const databaseConfig = require(__path_configs + "database");

var schema = new mongoose.Schema(
  {
    id: String,
    product_id: String,
    productVariantName: String,
    sku: String,
    price: Number,
    quantity: Number,
  }
);

module.exports = mongoose.model(databaseConfig.cocol_item_detaill_items, schema);
