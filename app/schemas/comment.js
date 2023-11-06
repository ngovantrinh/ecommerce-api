const mongoose = require("mongoose");
const databaseConfig = require(__path_configs + "database");

var schema = new mongoose.Schema(
  {
    userId: String,
    content: String,
    productId: String,
  },
  { collection: databaseConfig.col_comments }
);

module.exports = mongoose.model(databaseConfig.col_comments, schema);
