"use strict";
const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const Tag = require("../models/tag");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  a1Token,
  a2Token,
  testTagIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// POST /tags

describe("POST /tags", function () {
  test("works", async function () {
    const resp = await request(app)
      .post("/tags")
      .send({
        name: "New Tag",
      })
      .set("authorization", `Bearer ${a1Token}`);

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      tag: {
        id: expect.any(Number),
        name: "New Tag",
      },
    });
  });

  //   test("bad request with incorrect properties", async function () {
  //     const resp = await request(app)
  //       .post("/tags")
  //       .send({
  //         name: "New Tag",
  //         description: "A video about stuff",
  //       })
  //       .set("authorization", `Bearer ${a1Token}`);

  //     expect(resp.statusCode).toEqual(400);
  //     expect(resp.body).toEqual({
  //       error: {
  //         message: [
  //           'instance is not allowed to have the additional property "description"',
  //         ],
  //         status: 400,
  //       },
  //     });
  //   });
  //   test("bad request with no name", async function () {
  //     const resp = await request(app)
  //       .post("/tags")
  //       .send({})
  //       .set("authorization", `Bearer ${a1Token}`);

  //     expect(resp.statusCode).toEqual(400);
  //     expect(resp.body).toEqual({
  //       error: {
  //         message: ['instance requires property "name"'],
  //         status: 400,
  //       },
  //     });
  //   });

  test("Unauthorized with no token", async function () {
    const resp = await request(app).post("/tags").send({
      name: "New Tag",
    });
    expect(resp.statusCode).toEqual(401);
  });
});

// GET /tags

describe("GET /tags", function () {
  test("works", async function () {
    const resp = await await request(app).get("/tags");

    expect(resp.body).toEqual({
      tags: [
        {
          id: testTagIds[0],
          name: "Tag1",
        },
        {
          id: testTagIds[1],
          name: "Tag2",
        },
      ],
    });
  });
});

// GET /tags/:id

describe("GET /tags/:id", function () {
  test("works", async function () {
    const resp = await request(app).get(`/tags/${testTagIds[0]}`);
    expect(resp.body).toEqual({
      tag: {
        id: testTagIds[0],
        name: "Tag1",
      },
    });
  });

  test("not found for no such tag id", async function () {
    const resp = await request(app).get("/tags/0");
    expect(resp.statusCode).toEqual(404);
  });
});

// PATCH /tags/:id

describe("PATCH /tags/:id", function () {
  test("works", async function () {
    const resp = await request(app)
      .patch(`/tags/${testTagIds[0]}`)
      .send({
        name: "New Name",
      })
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.body).toEqual({
      tag: {
        id: testTagIds[0],
        name: "New Name",
      },
    });
  });

  //   test("bad request with incorrect properties", async function () {
  //     const resp = await request(app)
  //       .patch(`/tags/${testTagIds[0]}`)
  //       .send({
  //         name: "New Name",
  //         bio: "new video bio",
  //       })
  //       .set("authorization", `Bearer ${a1Token}`);

  //     expect(resp.statusCode).toEqual(400);
  //     expect(resp.body).toEqual({
  //       error: {
  //         message: [
  //           'instance is not allowed to have the additional property "bio"',
  //         ],
  //         status: 400,
  //       },
  //     });
  //   });

  test("not found on no such tag id", async function () {
    const resp = await request(app)
      .patch(`/tags/0`)
      .send({
        name: "New Nope",
      })
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("Unathorized with no token", async function () {
    const resp = await request(app).patch(`/tags/${testTagIds[0]}`).send({
      name: "New Name",
    });
    expect(resp.statusCode).toEqual(401);
  });
});

// DELETE /tags/:id

describe("DELETE /tags/:id", function () {
  test("works", async function () {
    const resp = await request(app)
      .delete(`/tags/${testTagIds[0]}`)
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.body).toEqual({
      deleted: `Tag with id: ${testTagIds[0]}`,
    });
  });

  test("not found for no such video id", async function () {
    const resp = await request(app)
      .delete(`/tags/0`)
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("Unauthorized with no token", async function () {
    const resp = await request(app).delete(`/tags/${testTagIds[0]}`);
    expect(resp.statusCode).toEqual(401);
  });
});
