const MainModel = require(__path_schemas + "cart");
const constants = require("../constants/constants");
module.exports = {
  getCart: () => {
    return MainModel.find({ status: 0 }).select("id cartId userId");
  },
  create: async (item) => {
    await MainModel.find()
      .sort({ id: -1 })
      .limit(1)
      .then(async (data) => {
        if (data.length) {
          let updatedId = data[0].id + 1;
          const newItem = {
            id: updatedId,
            ...item,
          };
          return await new MainModel(newItem).save();
        } else {
          const newItem = {
            id: constants.DEFAULT_ID,
            ...item,
          };
          return await new MainModel(newItem).save();
        }
      });
  },
  editCart: (params) => {
    return MainModel.updateOne({ id: params.id }, params.body);
  },
};
