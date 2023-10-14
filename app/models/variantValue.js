const MainModel = require(__path_schemas + "variantValue");

module.exports = {
  listItems: () => {
    return MainModel.find().select("id variant value");
    // return new MainModel.create({ id: 13, variant_id: 2, value: "XXL" }).save();
  },
};
