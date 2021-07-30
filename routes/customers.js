"use strict";

// Routes for customers

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Customer = require("../models/customer");

// const customerNewSchema = require("../schemas/customerNew.json");
// const customerUpdateSchema = require("../schemas/customerUpdate.json");

const router = express.Router();

// POST { customer }
//
// Adds a new customer.
// Data format { "name", "email", "phone", "company" }
//
// Authorization required: Admin

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    // const validator = jsonSchema.validate(req.body, customerNewSchema);
    // if (!validator.valid) {
    //   const errs = validator.errors.map((e) => e.stack);
    //   throw new BadRequestErrors(errs);
    // }
    const customer = await Customer.add(req.body);
    return res.status(201).json({ customer });
  } catch (err) {
    return next(err);
  }
});

// GET
//
// Get list of customers: { customes: [ { id, name, phone, email, company }, ... ] }
//
// Authorization required: Admin

router.get("/", ensureAdmin, async function (req, res, next) {
  try {
    const customers = await Customer.findAll();
    return res.json({ customers });
  } catch (err) {
    return next(err);
  }
});

// GET /:id
//
// Get customer by id: { id, name, email, phone, company }
//
// Authorization required: Admin

router.get("/:id", ensureAdmin, async function (req, res, next) {
  try {
    const customer = await Customer.get(req.params.id);
    return res.json({ customer });
  } catch (err) {
    return next(err);
  }
});

// PATCH /:id
//
// Update customer data
// Fields can be: { name, email, phone, company}
// Returns { id, name, email, phone, company }
// Authorization required: Admin

router.patch("/:id", ensureAdmin, async function (req, res, next) {
  try {
    // const validator = jsonSchema.validate(req.body, customerUpdateSchema);
    // if (!validator.valid) {
    //   const errs = validator.errors.map((e) => e.stack);
    //   throw new BadRequestErrors(errs);
    // }

    const customer = await Customer.update(req.params.id, req.body);
    return res.json({ customer });
  } catch (err) {
    return next(err);
  }
});

// DELETE /:id
//
// Delete customer
//
// Authorization: Admin

router.delete("/:id", ensureAdmin, async function (req, res, next) {
  try {
    await Customer.remove(req.params.id);
    return res.json({ deleted: `Customer with id: ${req.params.id}` });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
