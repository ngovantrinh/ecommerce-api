const MainModel = require(__path_schemas + "cupon");

module.exports = {
  getCupon: () => {
    return MainModel.find().select("name value cuponId");
  },
  findOneItem: (name) => {
    return MainModel.findOne({ name }).select("name value cuponId");
  },
  findByCode: (cuponId) => {
    return MainModel.findOne({ cuponId }).select("value");
  },
  create: (newData) => {
    return new MainModel(newData).save();
  },
};
