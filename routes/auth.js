"use strict";

/** Routes for authentication. */

const jsonschema = require("jsonschema");

const Admin = require("../models/admin");
const express = require("express");

const { createToken } = require("../helpers/tokens");
const adminAuthSchema = require("../schemas/adminAuth.json");
const { BadRequestError } = require("../expressError");

const router = express.Router();

// POST /auth/token: { username, password } => { token }
//
// Returns JWT token which can be used to authenticate further requests.
//
// Auth required: none

router.post("/token", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, adminAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const { username, password } = req.body;
    const admin = await Admin.authenticate(username, password);
    const token = createToken(admin);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
