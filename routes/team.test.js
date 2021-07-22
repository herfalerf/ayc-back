"use strict";
const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const Member = require("../models/member");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// POST /team

describe("POST /team", function () {
  test("works", async function () {
    const resp = await request(app).post("/team").send({
      name: "New Name",
      bio: "New Bio",
      img: "testimg.jpg",
    });

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      member: {
        id: expect.any(Number),
        name: "New Name",
        bio: "New Bio",
        img: "testimg.jpg",
      },
    });
  });
});
