"use strict";

// Routes for team

const jsonSchema = require("jsonschema");
const express = require("express");
const { BadRequestError } = require("../expressError");
const Member = require("../models/member");
const { toTitle } = require("../helpers/toTitle");
const { ensureAdmin } = require("../middleware/auth");

const memberNewSchema = require("../schemas/memberNew.json");
const memberUpdateSchema = require("../schemas/memberUpdate.json");

const router = express.Router();

// POST { member }
//
// Adds a new team member.  This allows the admin to add a new team member to the database.
//
// This returns the newly created team member {member: {id, name, bio, img}}
//
// Authorization required: Admin

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonSchema.validate(req.body, memberNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      console.log(validator);
      throw new BadRequestErrors(errs);
    }
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
    const formattedName = toTitle(req.params.name);

    const member = await Member.get(formattedName);
    return res.json({ member });
  } catch (err) {
    return next(err);
  }
});

// PATCH /team/:name { field1, field2 } => { member }
// Patches member data.
// Fields can be: { name, bio, img }
// Returns { id, name, bio, img }
// Authorization required: Admin

router.patch("/:name", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonSchema.validate(req.body, memberUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      console.log(validator);
      throw new BadRequestErrors(errs);
    }

    const formattedName = toTitle(req.params.name);
    const member = await Member.update(formattedName, req.body);
    return res.json({ member });
  } catch (err) {
    return next(err);
  }
});

// DELETE /team/:name => { deleted: name }
//
// Authorization: Admin

router.delete("/:name", ensureAdmin, async function (req, res, next) {
  try {
    const formattedName = toTitle(req.params.name);
    await Member.remove(formattedName);
    return res.json({ deleted: formattedName });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
