const MainModel = require(__path_schemas + "productVariant");
const constants = require("../constants/constants");
module.exports = {
  create: (allVariants, productId) => {
    MainModel.find()
      .sort({ id: -1 })
      .limit(1)
      .then(async (data) => {
        if (data.length) {
          let newData = await allVariants.map((element, index) => {
            return {
              id: data[0].id + index + 1,
              product_id: productId,
              ...element,
            };
          });
          return MainModel.insertMany(newData);
        } else {
          let newData = allVariants.map((element, index) => {
            return {
              id: index + 1,
              product_id: productId,
              ...element,
            };
          });
          return MainModel.insertMany(newData);
        }
      });
  },
  listItems: (listId) => {
    if (listId) {
      return MainModel.find({
        id: {
          $in: [...listId],
        },
      }).select(
        "id name product_id values quantity sku price salePrice createAt"
      );
    } else {
      return MainModel.find().select(
        "id name product_id values quantity sku price salePrice createAt"
      );
    }
  },
  findByProductId: (listId) => {
    if (listId) {
      return MainModel.find({
        product_id: {
          $in: [...listId],
        },
      }).select(
        "id name product_id values quantity sku price salePrice createAt"
      );
    } else {
      return MainModel.find().select(
        "id name product_id values quantity sku price salePrice createAt"
      );
    }
  },
  listItemsByValues: (listId) => {
    if (listId.length == 2) {
      return MainModel.find({
        values: [...listId],
      }).select(
        "id name product_id values quantity sku price salePrice createAt"
      );
    } else if (listId.length == 1) {
      return MainModel.find({
        values: listId[0],
      }).select(
        "id name product_id values quantity sku price salePrice createAt"
      );
    } else {
      return MainModel.find().select(
        "id name product_id values quantity sku price salePrice createAt"
      );
    }
  },
  findOneItem: (id) => {
    return MainModel.find({ id: id }).select(
      "id name values quantity sku price salePrice createAt"
    );
  },
};
