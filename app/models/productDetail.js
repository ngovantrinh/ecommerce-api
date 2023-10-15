const MainModel = require(__path_schemas + "productDetail");
const constants = require("../constants/constants");
module.exports = {
  create: (allVariants, productVariantId) => {
        MainModel.find()
          .sort({ id: -1 })
          .limit(1)
          .then((data) => {
            if (data.length) {
              let newData = allVariants.map((element, index) => {
                return {
                  id: data[0].id + index + 1,
                  product_variant_id: productVariantId,
                  variant_value_id: element,
                };
              });
              // return MainModel.insertMany(newData)
            } else {
              let newData = allVariants.map((element, index) => {
                return {
                  id: index + 1,
                  product_variant_id: productVariantId,
                  value_variant_id: element,
                };
              });
              console.log(newData);
              // return MainModel.insertMany(newData)
            }
          });
  },
};
