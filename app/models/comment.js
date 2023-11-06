const MainModel = require(__path_schemas + "comment");

module.exports = {
    create: (comment) => {
      return new MainModel(comment).save();
    },
    findCommentByProduct: (productId) => {
        return new MainModel.find({productId});
      },
  };
  