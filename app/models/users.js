const MainModel = require(__path_schemas + "users");
const constants = require("../constants/constants");

module.exports = {
  create: (user) => {
    return new MainModel(user).save();
  },
  findUser: (username) => {
    return MainModel.findOne({username : username}).select(
      "_id username displayName email phoneNumber country address zipCode photoUrl role active createAt"
    );
  },
  findUserById: (_id) => {
    return MainModel.findOne({_id}).select(
      "_id username displayName email phoneNumber country address zipCode photoUrl role active createAt"
    );
  },
  findUserLogin: (username) => {
    return MainModel.findOne({username : username}).select(
      "_id username password displayName email phoneNumber country address zipCode photoUrl role active createAt"
    );
  },
  getAllUserByAdmin: () => {
    return MainModel.find({role: constants.default_role}).select(
      "_id username displayName email phoneNumber country address zipCode photoUrl role active createAt"
    );
  },
  unActiveUser: (_id, value) => {
   return MainModel.updateOne({ _id }, { $set: { active: value } });
  }
};
