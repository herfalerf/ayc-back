const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createToken(admin) {
  //   console.assert(
  //     user.isAdmin !== undefined,
  //     "createToken passed user without isAdmin property"
  //   );

  let payload = {
    username: admin.username,
  };

  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
