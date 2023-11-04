const MainModel = require(__path_schemas + "cart");
const constants = require("../constants/constants");
module.exports = {
  getCart: (_id) => {
    return MainModel.findOne({ _id: _id }).select("id userId status");
  },
  getCartByUserId: (data) => {
    if(!data) return
    return MainModel.findOne({ userId: data.id, status: 0 }).select(
      "id userId status"
    );
  },
  getListCartOrder: (params, id) => {
    let pagination = {
      page: 1,
      limit: 10,
    };

    if (params.page) pagination.page = +params.page;
    if (params.limit) pagination.limit = +params.limit;
    return MainModel.find({ userId: id, status: 1 })
      .skip(pagination.limit * pagination.page - pagination.limit)
      .limit(pagination.limit)
      .select("id userId status orderPrice");
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
  findNewCart: () => {
    return MainModel.find().sort({ id: -1 }).limit(1);
  },
  editCart: (_id, body) => {
    return MainModel.updateOne({ _id }, body);
  },
};
