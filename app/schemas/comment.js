const mongoose = require("mongoose");
const databaseConfig = require(__path_configs + "database");

var schema = new mongoose.Schema(
  {
    productId: String,
    content: String,
    isActive: Boolean,
    userInfo: {
      userId: String,
      userName: String,
      displayName: String,
      photoUrl: String,
      role: Number,
    },

  },
  { collection: databaseConfig.col_comments }
);

module.exports = mongoose.model(databaseConfig.col_comments, schema);
