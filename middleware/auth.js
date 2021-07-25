"use strict";

// Convenience middleware to handle common auth cases in routes.

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

// Middleware to authenticate user.
// If a token was provided, verify it, and if valid store the token payload on res.locals (this will inlude the username and isAdmin field.)

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;

    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (err) {
    return next();
  }
}

//Middleware to use when they must be an admin.  Will check if correct user condition has beenm set/met prioor to checking for admin.
//
// If not, raises Unauthorized
function ensureIsAdmin(req, res, next) {
  try {
    console.log(res.locals);
    if (res.locals.match === true) return next();
    if (!res.locals.user) throw new UnauthorizedError();
    if (!res.locals.user.isAdmin) throw new UnauthorizedError();
    console.log(`user ${res.locals.user.username} is an Admin`);
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  authenticateJWT,
  ensureIsAdmin,
};
