const mongoose = require("mongoose");
const databaseConfig = require(__path_configs + "database");

var schema = new mongoose.Schema(
  {
    id: String,
    name: String,
    content: String,
    productId: Number,
  },
  { collection: atabaseConfig.col_comments }
);

module.exports = mongoose.model(databaseConfig.col_comments, schema);
