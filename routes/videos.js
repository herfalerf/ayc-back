"use strict";

// Routes for videos

const jsonSchema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Video = require("../models/video");

const videoNewSchema = require("../schemas/videoNew.json");
const videoUpdateSchema = require("../schemas/videoUpdate.json");

const router = express.Router();

// POST { video }
//
// Adds a new video.
// Data format { "name", "description", "link" }
//
// Authorization required: Admin

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonSchema.validate(req.body, videoNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const video = await Video.add(req.body);
    return res.status(201).json({ video });
  } catch (err) {
    return next(err);
  }
});

// GET
//
// Get list of videos: { videos: [ { id, name, description, link }, ... ] }
//
// Authorization required: None

router.get("/", async function (req, res, next) {
  try {
    if (req.query.tag) {
      const videos = await Video.findAll(req.query.tag);
      return res.json({ videos });
    } else {
      const videos = await Video.findAll();
      return res.json({ videos });
    }
  } catch (err) {
    return next(err);
  }
});

// GET /:id
//
// returns video by: {video: { id, name, description, link } }
//
// Authorization required: None

router.get("/:id", async function (req, res, next) {
  try {
    const video = await Video.get(req.params.id);
    return res.json({ video });
  } catch (err) {
    return next(err);
  }
});

// PATCH /:id
//
// Update video data
// Fields can be: { name, description, link }
// Returns { id, name, description, link }
// Authorization required: Admin

router.patch("/:id", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonSchema.validate(req.body, videoUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const video = await Video.update(req.params.id, req.body);
    return res.json({ video });
  } catch (err) {
    return next(err);
  }
});

// DELETE /:id
//
// Delete video by id
//
// Authorization: Admin

router.delete("/:id", ensureAdmin, async function (req, res, next) {
  try {
    await Video.remove(req.params.id);
    return res.json({ deleted: `Video with id: ${req.params.id}` });
  } catch (err) {
    return next(err);
  }
});

// POST /:id/tags
//
// Add tag to video: { tag }
//
// Authorization required: Admin

router.post("/:id/tag", ensureAdmin, async function (req, res, next) {
  try {
    const vtData = { video_id: req.params.id, tag_id: req.body.tag_id };
    await Video.addVideoTag(vtData);
    const video = await Video.get(req.params.id);
    return res.json({ video });
    // return res.json({ videoTag });
  } catch (err) {
    return next(err);
  }
});

// DELETE /:id/tags

// Remove tag from video: { tag }

// Authorization required: Admin

router.delete("/:id/tag", ensureAdmin, async function (req, res, next) {
  try {
    const vtData = { video_id: req.params.id, tag_id: req.body.tag_id };
    await Video.removeVideoTag(vtData);
    const video = await Video.get(req.params.id);
    return res.json({
      deleted: `Removed tag with id: ${vtData.tag_id} from video with id: ${req.params.id}`,
      video,
    });
    // return res.json({
    //   deleted: `Removed tag with id: ${vtData.tag_id} from video with id: ${req.params.id}`,
    // });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
