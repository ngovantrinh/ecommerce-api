const MainModel = require(__path_schemas + "comment");

module.exports = {
    create: (comment) => {
      return new MainModel(comment).save();
    },
    // findUser: (user) => {
    //     return new MainModel.findOne(user).lean();
    //   },
  };
  