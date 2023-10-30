const mongoose = require("mongoose");
const databaseConfig = require(__path_configs + "database");

var schema = new mongoose.Schema(
  {
    image: {
      data: Buffer,
      contentType: String,
    },
  }
  //   { collection: databaseConfig.col_images }
);

module.exports = mongoose.model(databaseConfig.col_images, schema);
