const MainModel = require(__path_schemas + "category");
const constants = require("../constants/constants");
module.exports = {
  create: (newData) => {
    return new MainModel(newData).save();
  },
  getListItems: () => {
    return MainModel.find().select("_id name");
  },
  deleteItem: (params) => {
    return MainModel.findOneAndDelete({ _id: params.id });
  },
  getItem: (_id) => {
    return MainModel.findOne({ _id }).select("_id name");
  },
  getItemByName: (name) => {
    return MainModel.findOne({ name }).select("_id name");
  },
  editItem: (params, body) => {
    return MainModel.updateOne({ _id: params.id }, body);
  },
};
