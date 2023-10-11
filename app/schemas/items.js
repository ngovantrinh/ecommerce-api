const mongoose = require("mongoose");
const databaseConfig = require(__path_configs + "database");

var schema = new mongoose.Schema(
  {
    id: String,
    name: String,
    status: String,
    img: String,
    price: Number,
    salePrice: Number,
    description: String,
    available: Number,
    sold: Number,
    createAt: String,
    // comment: {
    //   id: String,
    //   userId: String,
    //   content: String,
    //   productId: String,
    // },
  },
  { collection: "items" }
);

module.exports = mongoose.model(databaseConfig.col_items, schema);
