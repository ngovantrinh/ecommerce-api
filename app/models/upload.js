const MainModel = require(__path_schemas + "image");

module.exports = {
  create: (image) => {
    return new MainModel(image).save();
  },
  findItems: () => {
    return MainModel.find();
  }
};
