const MainModel = require(__path_schemas + "items");
const constants = require("../constants/constants");

module.exports = {
  listItems: (params, option, listProductId) => {
    let sort = {};
    let objWhere = {};
    let pagination = {
      page: 1,
      limit: 10,
    };

    if (params.keyword !== "") objWhere.name = new RegExp(params.keyword, "i");
    if (params.sortField) sort[params.sortField] = params.sortType;
    if (params.page) pagination.page = +params.page;
    if (params.limit) pagination.limit = +params.limit;
    if (option.task == "all") {
      return MainModel.find(
        {
          name: { $regex: objWhere.name },
        },
        {
          id: {
            $in: [...listProductId],
          },
        }
      )
        .skip(pagination.limit * pagination.page - pagination.limit)
        .limit(pagination.limit)
        .select(
          "id name image images description price salePrice quantity sold createAt"
        )
        .sort(sort);
    }

    if (option.task == "one") {
      return MainModel.find({ id: params.id }).select(
        "id name image images description price salePrice quantity sold createAt"
      );
    }
  },
  create: (item) => {
    return MainModel.find()
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
  deleteItem: (params, option) => {
    if (option.task == "one") {
      return MainModel.findOneAndDelete({ id: params.id });
    }
  },
  editItem: (params, option) => {
    if (option.task == "edit") {
      return MainModel.updateOne({ id: params.id }, params.body);
    }
  },
};
