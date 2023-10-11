const MainModel = require(__path_schemas + "cupon");

module.exports = {
  getCupon: () => {
    return MainModel.find().select(
      "name value cuponId"
    );
  },
};
