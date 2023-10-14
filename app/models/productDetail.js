const MainModel = require(__path_schemas + "productDetail");
const constants = require("../constants/constants");
module.exports = {
  create: (allVariants) => {
    // console.log(allVariants);
    //     MainModel.find()
    //       .sort({ id: -1 })
    //       .limit(1)
    //       .then((data) => {
    //         if (data.length) {
    //           let newData = allVariants.map((element, index) => {
    //             return {
    //               id: data[0].id + index + 1,
    //               ...element,
    //             };
    //           });
    //           return MainModel.insertMany(newData)
    //         } else {
    //           let newData = allVariants.map((element, index) => {
    //             return {
    //               id: index + 1,
    //               ...element,
    //             };
    //           });
    //           return MainModel.insertMany(newData)
    //         }
    //       });
  },
};
