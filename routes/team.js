"use strict";

// Routes for team

const express = require("express");
const { BadRequestError } = require("../expressError");
const Member = require("../models/member");
const { createToken } = require("../helpers/tokens");

const router = express.Router();

// POST { member }
//
// Adds a new team member.  This allows the admin to add a new team member to the database.
//
// This returns the newly created team member {member: {id, name, bio, img}}
//
// Authorization required: Admin

router.post("/", async function (req, res, next) {
  try {
    const member = await Member.addMember(req.body);
    return res.status(201).json({ member });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
