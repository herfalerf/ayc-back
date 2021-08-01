"use strict";
const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const Video = require("../models/video");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  a1Token,
  a2Token,
  testVideoIds,
  testTagIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// POST /videos

describe("POST /videos", function () {
  test("works", async function () {
    const resp = await request(app)
      .post("/videos")
      .send({
        name: "New Vid",
        description: "A video about stuff",
        link: "alinktoavideo.com",
      })
      .set("authorization", `Bearer ${a1Token}`);

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      video: {
        id: expect.any(Number),
        name: "New Vid",
        description: "A video about stuff",
        link: "alinktoavideo.com",
      },
    });
  });

  test("works with partial data", async function () {
    const resp = await request(app)
      .post("/videos")
      .send({
        name: "New Video",
        link: "somelink.com",
      })
      .set("authorization", `Bearer ${a1Token}`);

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      video: {
        id: expect.any(Number),
        name: "New Video",
        description: null,
        link: "somelink.com",
      },
    });
  });

  test("bad request with incorrect properties", async function () {
    const resp = await request(app)
      .post("/videos")
      .send({
        name: "New Vid",
        description: "A video about stuff",
        link: "alinktoavideo.com",
        bio: "why do i have a bio of a video?",
      })
      .set("authorization", `Bearer ${a1Token}`);

    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      error: {
        message: [
          'instance is not allowed to have the additional property "bio"',
        ],
        status: 400,
      },
    });
  });

  test("bad request with no link", async function () {
    const resp = await request(app)
      .post("/videos")
      .send({
        name: "New Vid",
        description: "A video about stuff",
      })
      .set("authorization", `Bearer ${a1Token}`);

    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      error: {
        message: ['instance requires property "link"'],
        status: 400,
      },
    });
  });

  test("bad request with no name", async function () {
    const resp = await request(app)
      .post("/videos")
      .send({
        description: "A video about stuff",
        link: "alinktoavideo.com",
      })
      .set("authorization", `Bearer ${a1Token}`);

    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      error: {
        message: ['instance requires property "name"'],
        status: 400,
      },
    });
  });

  test("Unauthorized with no token", async function () {
    const resp = await request(app).post("/videos").send({
      name: "New Vid",
      description: "A video about stuff",
      link: "alinktoavideo.com",
    });
    expect(resp.statusCode).toEqual(401);
  });
});

// GET /videos

describe("GET /videos", function () {
  test("works", async function () {
    const resp = await request(app).get("/videos");

    expect(resp.body).toEqual({
      videos: [
        {
          id: testVideoIds[0],
          name: "Test1",
          description: "Description1",
          link: "link1.com",
        },
        {
          id: testVideoIds[1],
          name: "Test2",
          description: "Description2",
          link: "link2.com",
        },
      ],
    });
  });

  test("works with query string", async function () {
    const resp = await request(app).get("/videos?tag=Tag1");

    expect(resp.body).toEqual({
      videos: [
        {
          id: testVideoIds[0],
          name: "Test1",
          description: "Description1",
          link: "link1.com",
          tag: "Tag1",
        },
      ],
    });
  });
});

// GET /videos/:id

describe("GET /videos/:id", function () {
  test("works", async function () {
    const resp = await request(app).get(`/videos/${testVideoIds[0]}`);
    expect(resp.body).toEqual({
      video: {
        id: testVideoIds[0],
        name: "Test1",
        description: "Description1",
        link: "link1.com",
        tags: ["Tag1"],
      },
    });
  });

  test("not found for no such video id", async function () {
    const resp = await request(app).get("/videos/0");
    expect(resp.statusCode).toEqual(404);
  });
});

// PATCH /videos/:id

describe("PATCH /videos/:id", function () {
  test("works", async function () {
    const resp = await request(app)
      .patch(`/videos/${testVideoIds[0]}`)
      .send({
        name: "New Name",
      })
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.body).toEqual({
      video: {
        id: testVideoIds[0],
        name: "New Name",
        description: "Description1",
        link: "link1.com",
      },
    });
  });

  test("bad request with incorrect properties", async function () {
    const resp = await request(app)
      .patch(`/customers/${testVideoIds[0]}`)
      .send({
        name: "New Name",
        bio: "new video bio",
      })
      .set("authorization", `Bearer ${a1Token}`);

    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      error: {
        message: [
          'instance is not allowed to have the additional property "bio"',
        ],
        status: 400,
      },
    });
  });

  test("not found on no such video id", async function () {
    const resp = await request(app)
      .patch(`/videos/0`)
      .send({
        name: "New Nope",
      })
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("Unathorized with no token", async function () {
    const resp = await request(app).patch(`/videos/${testVideoIds[0]}`).send({
      name: "New Name",
    });
    expect(resp.statusCode).toEqual(401);
  });
});

// DELETE /videos/:id

describe("DELETE /videos/:id", function () {
  test("works", async function () {
    const resp = await request(app)
      .delete(`/videos/${testVideoIds[0]}`)
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.body).toEqual({
      deleted: `Video with id: ${testVideoIds[0]}`,
    });
  });

  test("not found for no such video id", async function () {
    const resp = await request(app)
      .delete(`/videos/0`)
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("Unauthorized with no token", async function () {
    const resp = await request(app).delete(`/videos/${testVideoIds[0]}`);
    expect(resp.statusCode).toEqual(401);
  });
});

// POST /videos/:id/tag

describe("POST /videos/:id/tag", function () {
  test("works", async function () {
    const resp = await request(app)
      .post(`/videos/${testVideoIds[0]}/tag`)
      .send({
        video_id: testVideoIds[0],
        tag_id: testTagIds[1],
      })
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.body).toEqual({
      videoTag: {
        video_id: testVideoIds[0],
        tag_id: testTagIds[1],
      },
    });
  });

  test("not found for no such video id", async function () {
    const resp = await request(app)
      .post(`/videos/0/tag`)
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("not found for no such tag id", async function () {
    const resp = await request(app)
      .post(`/videos/${testVideoIds[0]}/tag`)
      .send({
        video_id: testVideoIds[0],
        tag_id: 0,
      })
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("Unauthorized with no token", async function () {
    const resp = await request(app).post(`/videos/${testVideoIds[0]}/tag`);
    expect(resp.statusCode).toEqual(401);
  });
});

// DELETE /videos/:id/tag

describe("DELETE /videos/:id/tag", function () {
  test("works", async function () {
    const resp = await request(app)
      .delete(`/videos/${testVideoIds[0]}/tag`)
      .send({
        video_id: testVideoIds[0],
        tag_id: testTagIds[0],
      })
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.body).toEqual({
      deleted: `Removed tag with id: ${testTagIds[0]} from video with id: ${testVideoIds[0]}`,
    });
  });

  test("not found for no such video id", async function () {
    const resp = await request(app)
      .delete(`/videos/0/tag`)
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("not found for no such tag id", async function () {
    const resp = await request(app)
      .delete(`/videos/${testVideoIds[0]}/tag`)
      .send({
        video_id: testVideoIds[0],
        tag_id: 0,
      })
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("Unauthorized with no token", async function () {
    const resp = await request(app).delete(`/videos/${testVideoIds[0]}/tag`);
    expect(resp.statusCode).toEqual(401);
  });
});
