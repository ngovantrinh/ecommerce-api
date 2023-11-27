const MainModel = require(__path_schemas + "comment");

module.exports = {
  create: (comment) => {
    return new MainModel(comment).save();
  },
  findCommentByProduct: (id) => {
    return MainModel.findOne({ productId: id }).select(
      "userInfo content productId"
    );
  },
  getListComment: () => {
    return MainModel.find().select(
      "userInfo content productId"
    );
  },
};
