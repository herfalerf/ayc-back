"use strict";

// Routes for team

const express = require("express");
const { BadRequestError } = require("../expressError");
const Member = require("../models/member");
const { createToken } = require("../helpers/tokens");
const { toTitle } = require("../helpers/toTitle");

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

// GET
//
// Get list of team members {team: [ { id, name, bio, img }, ...] }
//
// Authorization required: None

router.get("/", async function (req, res, next) {
  try {
    const team = await Member.findAll();
    return res.json({ team });
  } catch (err) {
    return next(err);
  }
});

// GET /[name]
//
// Get member by name: { id, name, bio, img }
//
//Authorization required: None

router.get("/:name", async function (req, res, next) {
  try {
    const titleCaseName = toTitle(req.params.name);
    const member = await Member.get(titleCaseName);
    return res.json({ member });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
