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

// GET /team

describe("GET /team", function () {
  test("works", async function () {
    const resp = await request(app).get("/team");
    expect(resp.body).toEqual({
      team: [
        {
          id: expect.any(Number),
          name: "Team Member",
          bio: "Team member bio",
          img: "https://via.placeholder.com/150",
        },
        {
          id: expect.any(Number),
          name: "Team Member 2",
          bio: "Team member bio 2",
          img: "https://via.placeholder.com/150",
        },
      ],
    });
  });
});

// GET /team/:name

describe("GET /companies/:name", function () {
  test("works", async function () {
    const resp = await request(app).get(`/team/team-member`);
    expect(resp.body).toEqual({
      member: {
        id: expect.any(Number),
        name: "Team Member",
        bio: "Team member bio",
        img: "https://via.placeholder.com/150",
      },
    });
  });
});
