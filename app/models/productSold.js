const MainModel = require(__path_schemas + "productSold");

module.exports = {
  findItem: () => {
    return MainModel.find().select("quantity salesProfit");
  },
  editQuantity: (item, quantity,orderPrice) => {
    let body = {
      quantity: item.quantity + quantity,
      salesProfit: item.salesProfit + orderPrice
    };
    return MainModel.updateOne({ _id: item._id }, body);
  },
};
