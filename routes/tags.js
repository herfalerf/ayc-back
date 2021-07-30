"use strict";

// Routes for videos

const jsonSchema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Tag = require("../models/tag");

// const tagNewSchema = require("../schemas/videoNew.json");
// const tagUpdateSchema = require("../schemas/videoUpdate.json");

const router = express.Router();

// POST { tag }
//
// Adds a new tag.
// Data format { name }
//
// Authorization required: Admin

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    // const validator = jsonSchema.validate(req.body, videoNewSchema);
    // if (!validator.valid) {
    //   const errs = validator.errors.map((e) => e.stack);
    //   throw new BadRequestError(errs);
    // }
    const tag = await Tag.add(req.body);
    return res.status(201).json({ tag });
  } catch (err) {
    return next(err);
  }
});

// GET
//
// Get list of tags: { tags: [ { id, name }, ... ] }
//
// Authorization required: None

router.get("/", async function (req, res, next) {
  try {
    const tags = await Tag.findAll();
    return res.json({ videos });
  } catch (err) {
    return next(err);
  }
});

// GET /:id
//
// Get tag by id: { id, name }
//
// Authorization required: None

router.get("/:id", async function (req, res, next) {
  try {
    const tag = await Tag.get(req.params.id);
    return res.json({ tag });
  } catch (err) {
    return next(err);
  }
});

// PATCH /:id
//
// Update tag name
// Fields can be: { name }
//
// returns { id, name }
//
// Authorization required: Admin

router.patch("/:id", ensureAdmin, async function (req, res, next) {
  try {
    // const validator = jsonSchema.validate(req.body, videoUpdateSchema);
    // if (!validator.valid) {
    //   const errs = validator.errors.map((e) => e.stack);
    //   throw new BadRequestError(errs);
    // }

    const tag = await Tag.update(req.params.id, req.body);
    return res.json({ tag });
  } catch (err) {
    return next(err);
  }
});

// DELETE /:id
//
// Delete tag by id
//
// Authorization required: Admin

router.delete("/:id", ensureAdmin, async function (req, res, next) {
  try {
    await Tag.remove(req.params.id);
    return res.json({ deleted: `Tag with id: ${req.params.id}` });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
