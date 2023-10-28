const MainModel = require(__path_schemas + "cartProduct");
const constants = require("../constants/constants");
module.exports = {
  getCartProduct: (cartId) => {
    return MainModel.find({ cartId: cartId }).select(
      "id cartId variantId quantity"
    );
  },
  getCartProductById: (id) => {
    return MainModel.find({ id: id }).select("id cartId variantId quantity");
  },
  getCartProductByProductId: (variantId, cartId) => {
    return MainModel.find({ cartId: cartId,variantId: variantId }).select(
      "id cartId variantId quantity"
    );
  },
  createCart: (item) => {
    MainModel.find()
      .sort({ id: -1 })
      .limit(1)
      .then(async (data) => {
        if (data.length) {
          let updatedId = data[0].id + 1;
          const newItem = {
            id: updatedId,
            ...item,
          };
          return new MainModel(newItem).save();
        } else {
          const newItem = {
            id: constants.DEFAULT_ID,
            ...item,
          };
          return new MainModel(newItem).save();
        }
      });
  },
  deleteItem: (params) => {
    return MainModel.findOneAndDelete({ id: params.id });
  },
  editItem: (params) => {
    return MainModel.updateOne(
      { id: params.id },
      { quantity: params.quantity }
    );
  },
};
