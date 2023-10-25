const mongoose = require("mongoose");
const databaseConfig = require(__path_configs + "database");

var schema = new mongoose.Schema(
  {
    id: Number,
    userId: String,
    status: Number
  },
);

module.exports = mongoose.model(databaseConfig.col_cart, schema);