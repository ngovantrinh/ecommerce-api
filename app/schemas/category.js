const mongoose = require("mongoose");
const databaseConfig = require(__path_configs + "database");

var schema = new mongoose.Schema({
  name: String,
});

module.exports = mongoose.model(databaseConfig.col_category, schema);
