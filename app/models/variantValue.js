const MainModel = require(__path_schemas + "variantValue");

module.exports = {
  listItems: (list) => {
    if (list) {
      return MainModel.find({
        id: {
          $in: [...list],
        },
      }).select("id variant_id value");
    } else {
      return MainModel.find().select("id variant_id value");
    }
  },
};
