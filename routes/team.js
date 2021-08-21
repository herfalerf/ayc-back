"use strict";

// Routes for team

const jsonSchema = require("jsonschema");
const express = require("express");
const Member = require("../models/member");
// const { toTitle } = require("../helpers/toTitle");
const { BadRequestError } = require("../expressError");
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
      throw new BadRequestError(errs);
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

// GET /:id
//
// Get member by name: { id, name, bio, img }
//
//Authorization required: None

router.get("/:id", async function (req, res, next) {
  try {
    const member = await Member.get(req.params.id);
    return res.json({ member });
  } catch (err) {
    return next(err);
  }
});

// PATCH /:id { field1, field2 } => { member }
// Patches member data.
// Fields can be: { name, bio, img }
// Returns { id, name, bio, img }
// Authorization required: Admin

router.patch("/:id", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonSchema.validate(req.body, memberUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const member = await Member.update(req.params.id, req.body);
    return res.json({ member });
  } catch (err) {
    return next(err);
  }
});

// DELETE /:name => { deleted: name }
//
// Authorization: Admin

router.delete("/:id", ensureAdmin, async function (req, res, next) {
  try {
    await Member.remove(req.params.id);
    return res.json({ deleted: `Team Member with id: ${req.params.id}` });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
