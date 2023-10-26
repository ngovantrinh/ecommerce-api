const mongoose = require("mongoose");
const databaseConfig = require(__path_configs + "database");

var schema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    displayName: String,
    email: String,
    phoneNumber: String,
    country: String,
    address: String,
    zipCode: String,
    photoUrl: String,
    role: Number,
    active: Number,
    createAt: String
  },
  { collection: databaseConfig.col_user }
);

module.exports = mongoose.model(databaseConfig.col_user, schema);
