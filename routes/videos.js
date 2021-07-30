"use strict";

// Routes for videos

const jsonSchema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Video = require("../models/video");

// const videoNewSchema = require("../schemas/videoNew.json");
// const videoUpdateSchema = require("../schemas/videoUpdate.json");

const router = express.Router();

// POST { video }
//
// Adds a new video.
// Data format { "name", "description", "link" }
//
// Authorization required: Admin

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    //   const validator = jsonSchema.validate(req.body, customerNewSchema);
    //   if (!validator.valid) {
    //     const errs = validator.errors.map((e) => e.stack);
    //     throw new BadRequestError(errs);
    //   }
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
    const videos = await Video.findAll();
    return res.json({ videos });
  } catch (err) {
    return next(err);
  }
});
