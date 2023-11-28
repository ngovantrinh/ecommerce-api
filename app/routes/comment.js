var express = require("express");
var router = express.Router();
const constants = require("../constants/constants");

const jwt = require("jsonwebtoken");
const controllerName = "comment";
const MainModel = require(__path_models + controllerName);
const productModal = require(__path_schemas + "items");

router.post("/add/:productId", async (req, res, next) => {
  try {
    let { productId } = req.params;
    const productItem = await productModal.findOne({ _id: productId });
    let dataJwt = null;
    if (!productItem) {
      return res.status(401).json({
        success: false,
        message: "Product doesn't exist",
      });
    }
    if (constants.extractToken(req)) {
      dataJwt = await jwt.verify(
        constants.extractToken(req),
        process.env.JWT_SECRET
      );
    }

    if (!dataJwt) {
      return res.status(400).json({
        success: false,
        message: "Hey you must login before commenting",
      });
    }
    let comment = {
      productId: req.params.productId,
      content: req.body.content,
      isActive: false,
      userInfo: {
        userId: dataJwt.id,
        userName: dataJwt.username,
        displayName: dataJwt.displayName,
        photoUrl: dataJwt.photoUrl,
        role: dataJwt.role,
      },
    };
    await MainModel.create(comment);
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }

  next();
});

router.put("/edit/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    let dataJwt = null;

    if (constants.extractToken(req)) {
      dataJwt = await jwt.verify(
        constants.extractToken(req),
        process.env.JWT_SECRET
      );
    }
    const comment = await MainModel.findCommentById({ _id: id });
    if (comment.userInfo.userId !== dataJwt.id) {
      return res.status(400).json({
        success: false,
        message: "Something wen't wrong",
      });
    }

    let params = {
      content: req.body.content,
    };
    await MainModel.editComment(id, params);
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
    });
  }
});

router.put("/active/change/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    let dataJwt = null;

    if (constants.extractToken(req)) {
      dataJwt = await jwt.verify(
        constants.extractToken(req),
        process.env.JWT_SECRET
      );
    }
    if (dataJwt.role !== 0) {
      return res.status(400).json({
        success: false,
        message: "Authority not allowed",
      });
    }

    const comment = await MainModel.findCommentById({ _id: id });
    let params = {
      isActive: !comment.isActive,
    };
    await MainModel.editComment(id, params);
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
    });
  }
});

router.delete("/delete/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    let dataJwt = null;

    if (constants.extractToken(req)) {
      dataJwt = await jwt.verify(
        constants.extractToken(req),
        process.env.JWT_SECRET
      );
    }
    const comment = await MainModel.findCommentById({ _id: id });

    if (!comment) {
      return res.status(400).json({
        success: false,
        message: "Comment does't exist",
      });
    }

    if (dataJwt.role === 1) {
      if (comment.userInfo.userId !== dataJwt.id) {
        return res.status(400).json({
          success: false,
          message: "Something wen't wrong",
        });
      }
      await MainModel.deleteComment(id);
      return res.status(200).json({
        success: true,
      });
    }

    await MainModel.deleteComment(id);
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
    });
  }
});

module.exports = router;
