const MainModel = require(__path_schemas + "variants");

module.exports = {
  create: (item) => {
    return new MainModel(item).save();
  },
  listItems: (params, option) => {
    if (option.task == "all") {
      return MainModel.find().select(
        "id variant"
      );
    }
  },

};
