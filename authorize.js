const db = require("./dbconfig");

module.exports = async function (req, res, next) {
  //Get token from header
  const token = req.header("Authorization");

  if (!token) {
    res.status(401).json({
      status: 401,
      message: "No token, authorization denied",
      data: req.body,
      errors: null,
    });
  }

  try {
    const resultToken = token.substring(6);

    const sql = "SELECT id FROM user where access_token=?";

    const data = await db.query(sql, resultToken);

    // if (data.length > 0) {
    //   next();
    // } else {
    //   res.status(401).json({
    //     status: 0,
    //     message: "Token not valid, authorization denied",
    //     data: req.body,
    //     errors: null,
    //   });
    // }
  } catch (err) {
    res.status(401).json({
      status: 0,
      message: "Token not valid, authorization denied",
      data: req.body,
      errors: null,
    });
  }
};
