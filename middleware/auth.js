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

function ensureAdmin(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  authenticateJWT,
  ensureAdmin,
};
