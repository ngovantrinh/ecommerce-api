const mongoose = require("mongoose");
const databaseConfig = require(__path_configs + "database");

var schema = new mongoose.Schema(
  {
    id: Number,
    name: String,
    image: String,
    images: Array,
    description: String,
    price: Number,
    salePrice: Number,
    quantity: Number,
    sold: Number,
    categoryId: String,
    createAt: String,
  },
  { collection: "items" }
);

module.exports = mongoose.model(databaseConfig.col_items, schema);
