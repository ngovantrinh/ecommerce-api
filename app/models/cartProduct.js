const MainModel = require(__path_schemas + "cartProduct");
const constants = require("../constants/constants");
module.exports = {
  getCartProduct: () => {
    return MainModel.find({ status: 0 }).select("id cartId variantId quantity status");
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
};
