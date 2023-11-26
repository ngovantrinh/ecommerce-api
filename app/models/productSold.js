const MainModel = require(__path_schemas + "productSold");

module.exports = {
  findItem: () => {
    return MainModel.find().select("quantity");
  },
  editQuantity: (item, quantity) => {
    let body = {
      quantity: item.quantity + quantity,
    };
    return MainModel.updateOne({ _id: item._id }, body);
  },
};
