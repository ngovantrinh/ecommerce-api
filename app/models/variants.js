const MainModel = require(__path_schemas + "variants");

module.exports = {
  create: (item) => {
    return new MainModel(item).save();
  },
  listItems: (params, option) => {
    if (option.task == "product") {
      return MainModel.find({ productId: params.productId }).select(
        "id productId variantName variantDescription priceProduct available sold createAt"
      );
    }
    if (option.task == "id") {
      return MainModel.find({ id: params.id }).select(
        "id productId variantName variantDescription priceProduct available sold createAt"
      );
    }
  },
  findItemBySize: (params) => {
    return MainModel.find({ variantDescription: params.size }).select(
      "productId variantDescription"
    );
  },
};
