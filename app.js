"use strict";

// Express app for AYC

const express = require("express");

const { NotFoundError } = require("./expressError");

const teamRoutes = require("./routes/team");

const app = express();

app.use(express.json());

app.use("/team", teamRoutes);

//Handle 404 errors
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

// Generic error handler; anything unhandled goes here.
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
