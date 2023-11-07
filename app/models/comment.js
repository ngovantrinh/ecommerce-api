const MainModel = require(__path_schemas + "comment");

module.exports = {
  create: (comment) => {
    return new MainModel(comment).save();
  },
  findCommentByProduct: (id) => {
    return MainModel.findOne({ productId: id }).select(
      "userId content productId"
    );
  },
};
