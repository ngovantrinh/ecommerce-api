var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const constants = require("../constants/constants");

const Users = require(__path_schemas + "users");

const controllerName = "users";
const MainModel = require(__path_models + controllerName);

router.post("/change-password", async (req, res, next) => {
  try {
    const { newPassword: plainTextPassword } = req.body;

    if (constants.extractToken(req) === null)
      return res.status(404).json({
        success: false,
        message: "Don't have token",
      });

    let dataJwt = await jwt.verify(
      constants.extractToken(req),
      process.env.JWT_SECRET
    );
    if (!plainTextPassword || typeof plainTextPassword !== "string") {
      return res.status(404).json({
        success: false,
        message: "Invalid password",
      });
    }

    if (plainTextPassword.length < 5) {
      return res.status(404).json({
        success: false,
        message: "Password too small, Should be atleast 6 characters",
      });
    }

    const _id = dataJwt.id;

    const password = await bcrypt.hash(plainTextPassword, 10);

    await Users.updateOne({ _id }, { $set: { password } });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "error",
    });
  }
});

router.post("/update-profile", async (req, res, next) => {
  try {
    if (constants.extractToken(req) === null) {
      return res.status(404).json({
        success: false,
        message: "Don't have token",
      });
    }

    let dataJwt = await jwt.verify(
      constants.extractToken(req),
      process.env.JWT_SECRET
    );

    // const { displayName,email,phoneNumber } = req.body;

    const _id = dataJwt.id;
    await Users.updateOne({ _id }, { $set: req.body });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "error",
    });
  }
});

router.post("/register", async (req, res, next) => {
  // res.send('Get all  items')
  const {
    username,
    password: plainTextPassword,
    displayName,
    email,
    phoneNumber,
    country,
    address,
    zipCode,
    photoUrl,
  } = req.body;
  if (!username || typeof username !== "string") {
    return res.status(404).json({
      success: false,
      message: "Invalid username",
    });
  }

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.status(404).json({
      success: false,
      message: "Invalid password",
    });
  }

  if (plainTextPassword.length < 5) {
    return res.status(404).json({
      success: false,
      message: "Password too small, Should be atleast 5 characters",
    });
  }

  const password = await bcrypt.hash(plainTextPassword, 10);
  let data = {
    username: username,
    password: password,
    displayName: displayName || "",
    role: constants.default_role,
    email: email || "",
    phoneNumber: phoneNumber || "",
    country: country || "",
    address: address || "",
    zipCode: zipCode || "",
    photoUrl: photoUrl || "",
    active: 1,
    createAt: constants.getTime(),
  };
  try {
    await MainModel.create(data);
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    if ((error.code = 11000)) {
      return res.status(400).json({
        success: false,
        message: "Username already in use",
      });
    }
    throw error;
  }
});

router.post("/login", async (req, res, next) => {
  // res.send('Get all  items')

  try {
    const { username, password } = req.body;

    const userInfo = await MainModel.findUserLogin(username);

    if (!userInfo) {
      return res.status(401).json({
        success: false,
        message: "User doesn't exist",
      });
    }

    if (userInfo.active !== constants.USER_DEFAULT_ACTIVE) {
      return res.status(400).json({
        success: false,
        message: "Account is temporarily locked",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userInfo.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const access_token = jwt.sign(
      {
        id: userInfo._id,
        username: userInfo.username,
        displayName: userInfo.displayName,
        role: userInfo.role,
        photoUrl: userInfo.photoUrl,
        active: userInfo.active,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
    return res.status(200).json({
      success: true,
      access_token,
      user: {
        id: userInfo._id,
        username: userInfo.username,
        displayName: userInfo.displayName,
        email: userInfo.email,
        phoneNumber: userInfo.phoneNumber,
        country: userInfo.country,
        address: userInfo.address,
        zipCode: userInfo.zipCode,
        photoUrl: userInfo.photoUrl,
        role: userInfo.role,
        active: userInfo.active,
        createAt: userInfo.createAt,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

router.get("/getAllUser", async (req, res, next) => {
  // res.send('Get all  items')

  try {
    const users = await MainModel.getAllUserByAdmin();

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

router.put("/disableUsers", async (req, res, next) => {
  // res.send('Get all  items')

  try {
    const { userId } = req.body;
    const users = await MainModel.findUserById(userId);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Something went wrong",
      });
    }
    let value = 0;

    if (users.active === constants.USER_DEFAULT_ACTIVE)
      value = constants.USER_DEFAULT_UNACTIVE;
    else value = constants.USER_DEFAULT_ACTIVE;

    await MainModel.unActiveUser(users._id, value);

    return res.status(200).json({
      success: true,
      message: "Success",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

router.get("/userDetail", async (req, res, next) => {
  // res.send('Get all  items')
  try {
    if (constants.extractToken(req) === null)
      return res.status(404).json({
        success: false,
        message: "Don't have token",
      });

    let dataJwt = await jwt.verify(
      constants.extractToken(req),
      process.env.JWT_SECRET
    );

    const { username } = dataJwt;
    const userInfo = await MainModel.findUser(username);

    return res.status(200).json({
      success: true,
      user: userInfo,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

router.get("/maintenance/location", async (req, res, next) => {
  // res.send('Get all  items')
  try {
    let data = constants.locationMaintenance.data
    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

module.exports = router;
