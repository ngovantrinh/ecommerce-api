const mongoose = require("mongoose");
const databaseConfig = require(__path_configs + "database");

var schema = new mongoose.Schema({
  quantity: Number,
});

module.exports = mongoose.model(databaseConfig.col_product_sold, schema);
