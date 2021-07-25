"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

// Related functions for admin

class Admin {
  // Authenticate user with username, password
  //
  // Returns { username }
  //
  // Throws UnauthorizedError if user not found or wrong password.

  static async authenticate(username, password) {
    //   try to find the user first
    const result = await db.query(
      `SELECT username, password
        FROM admins
        WHERE username = $1`,
      [username]
    );

    const admin = result.rows[0];

    if (admin) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, admin.password);
      if (isValid === true) {
        delete admin.password;
        return admin;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }
}

module.exports = Admin;
