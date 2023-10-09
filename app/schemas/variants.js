const mongoose = require("mongoose");
const databaseConfig = require(__path_configs + "database");

var schema = new mongoose.Schema(
  {
    id: String,
    productId: Number,
    variantName: String,
    variantDescription: String,
    priceProduct: Number,
    available: Number,
    sold: Number,
    createAt: String
  },
  { collection: databaseConfig.col_vatiants }
);

module.exports = mongoose.model(databaseConfig.col_vatiants, schema);
