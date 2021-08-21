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
  a1Token,
  a2Token,
  testTeamIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// POST /team

describe("POST /team", function () {
  test("works", async function () {
    const resp = await request(app)
      .post("/team")
      .send({
        name: "New Name",
        title: "New Title",
        bio: "New Bio",
        img: "testimg.jpg",
      })
      .set("authorization", `Bearer ${a1Token}`);

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      member: {
        id: expect.any(Number),
        name: "New Name",
        title: "New Title",
        bio: "New Bio",
        img: "testimg.jpg",
      },
    });
  });

  test("works with partial data", async function () {
    const resp = await request(app)
      .post("/team")
      .send({
        name: "New Name",
        title: "New Title",
      })
      .set("authorization", `Bearer ${a1Token}`);

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      member: {
        id: expect.any(Number),
        name: "New Name",
        title: "New Title",
        bio: null,
        img: null,
      },
    });
  });

  test("bad request with no name", async function () {
    const resp = await request(app)
      .post("/team")
      .send({
        title: "member title",
        bio: "member bio",
        img: "memberimg.jpg",
      })
      .set("authorization", `Bearer ${a1Token}`);

    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      error: { message: ['instance requires property "name"'], status: 400 },
    });
  });

  test("bad request with incorrect properties", async function () {
    const resp = await request(app)
      .post("/team")
      .send({
        name: "New Name",
        title: "New Title",
        bio: "member bio",
        img: "memberimg.jpg",
        experience: "20 years",
      })
      .set("authorization", `Bearer ${a1Token}`);

    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      error: {
        message: [
          'instance is not allowed to have the additional property "experience"',
        ],
        status: 400,
      },
    });
  });

  test("unauthorized with no token", async function () {
    const resp = await request(app).post("/team").send({
      name: "New Name",
      bio: "New Bio",
      img: "testimg.jpg",
    });

    expect(resp.statusCode).toEqual(401);
    expect(resp.body).toEqual({
      error: {
        message: "Unauthorized",
        status: 401,
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
          title: "Member Title",
          bio: "Team member bio",
          img: "https://via.placeholder.com/150",
        },
        {
          id: expect.any(Number),
          name: "Team Member 2",
          title: "Member Title 2",
          bio: "Team member bio 2",
          img: "https://via.placeholder.com/150",
        },
      ],
    });
  });
});

// GET /team/:id

describe("GET /team/:id", function () {
  test("works", async function () {
    const resp = await request(app).get(`/team/${testTeamIds[0]}`);
    expect(resp.body).toEqual({
      member: {
        id: testTeamIds[0],
        name: "Team Member",
        title: "Member Title",
        bio: "Team member bio",
        img: "https://via.placeholder.com/150",
      },
    });
  });

  test("not found for no such member", async function () {
    const resp = await request(app).get(`/team/0`);
    expect(resp.statusCode).toEqual(404);
  });
});

// PATCH /team/:id

describe("PATCH /team/:id", function () {
  test("works", async function () {
    const resp = await request(app)
      .patch(`/team/${testTeamIds[0]}`)
      .send({
        name: "New Name",
      })
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.body).toEqual({
      member: {
        id: testTeamIds[0],
        name: "New Name",
        title: "Member Title",
        bio: "Team member bio",
        img: "https://via.placeholder.com/150",
      },
    });
  });

  test("bad request with incorrect properties", async function () {
    const resp = await request(app)
      .patch(`/team/${testTeamIds[0]}`)
      .send({
        name: "New Name",
        title: "New Title",
        bio: "member bio",
        img: "memberimg.jpg",
        experience: "20 years",
      })
      .set("authorization", `Bearer ${a1Token}`);

    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      error: {
        message: [
          'instance is not allowed to have the additional property "experience"',
        ],
        status: 400,
      },
    });
  });

  test("not found on no such member", async function () {
    const resp = await request(app)
      .patch("/team/0")
      .send({
        name: "New Nope",
      })
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("unauthorized with no token", async function () {
    const resp = await request(app).patch(`/team/${testTeamIds[0]}`).send({
      name: "New Name",
    });

    expect(resp.statusCode).toEqual(401);
    expect(resp.body).toEqual({
      error: {
        message: "Unauthorized",
        status: 401,
      },
    });
  });
});

// DELETE /team/:id

describe("DELETE /team/:id", function () {
  test("works", async function () {
    const resp = await request(app)
      .delete(`/team/${testTeamIds[0]}`)
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.body).toEqual({
      deleted: `Team Member with id: ${testTeamIds[0]}`,
    });
  });

  test("not found for no such member", async function () {
    const resp = await request(app)
      .delete(`/team/0`)
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("unauthorized with no token", async function () {
    const resp = await request(app).delete(`/team/${testTeamIds[0]}`).send({
      name: "New Name",
    });

    expect(resp.statusCode).toEqual(401);
    expect(resp.body).toEqual({
      error: {
        message: "Unauthorized",
        status: 401,
      },
    });
  });
});
