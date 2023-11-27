const MainModel = require(__path_schemas + "comment");

module.exports = {
  create: (comment) => {
    return new MainModel(comment).save();
  },
  findCommentByProduct: (id) => {
    return MainModel.find({ productId: id }).select(
      "productId content userInfo isActive"
    );
  },
  findCommentById: (id) => {
    return MainModel.findOne({ _id: id }).select(
      "productId content userInfo isActive"
    );
  },
  getListComment: () => {
    return MainModel.find().select("productId content userInfo isActive");
  },
  editComment: (id, params) => {
    return MainModel.updateOne({ _id: id }, params);
  },
  deleteComment: (id) => {
    return MainModel.findOneAndDelete({ _id: id });
  },
};
