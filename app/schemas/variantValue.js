const mongoose = require("mongoose");
const databaseConfig = require(__path_configs + "database");

var schema = new mongoose.Schema(
  {
    id: Number,
    variant_id: Number,
    value: String,
  },
  { collection: "variant_values" }
);

module.exports = mongoose.model(databaseConfig.col_vatiant_value, schema);
