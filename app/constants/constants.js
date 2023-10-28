const bearer = "Bearer";

const getTime = () => {
  let today = new Date();
  let date =
    today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
  let time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return (dateTime = date + " " + time);
};

const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === bearer
  ) {
    return req.headers.authorization.split(" ")[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
};

module.exports = {
  default_role: 1,
  DEFAULT_ID: 1,
  USER_DEFAULT_ACTIVE: 1,
  USER_DEFAULT_UNACTIVE: 2,
  STATUS_PAYMENTR: 1,
  getTime,
  extractToken,
};
