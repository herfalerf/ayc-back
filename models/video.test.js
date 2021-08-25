"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const Video = require("./video.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testTagIds,
  testVideoIds,
} = require("./_testCommon");
const { fail } = require("assert");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// *********** ADD
describe("add", function () {
  const newVideo = {
    name: "New Vid",
    description: "New Des",
    link: "newlink.com",
  };

  test("works", async function () {
    let video = await Video.add(newVideo);
    expect(video).toEqual({
      id: expect.any(Number),
      ...newVideo,
    });

    const result = await db.query(
      `SELECT id, name, description, link FROM videos WHERE name = 'New Vid'`
    );

    expect(result.rows).toEqual([
      {
        id: expect.any(Number),
        name: "New Vid",
        description: "New Des",
        link: "newlink.com",
      },
    ]);
  });

  test("bad request with dupe", async function () {
    try {
      await Video.add(newVideo);
      await Video.add(newVideo);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

// **************** findAll

describe("findAll", function () {
  test("works", async function () {
    let videos = await Video.findAll();
    expect(videos).toEqual([
      {
        id: expect.any(Number),
        name: "v1",
        description: "v1 describe",
        link: "v1link.com",
      },
      {
        id: expect.any(Number),
        name: "v2",
        description: "v2 describe",
        link: "v2link.com",
      },
      {
        id: expect.any(Number),
        name: "v3",
        description: "v3 describe",
        link: "v3link.com",
      },
    ]);
  });

  test("works when providing tag", async function () {
    let videos = await Video.findAll("Tag1");
    expect(videos).toEqual([
      {
        id: expect.any(Number),
        name: "v1",
        description: "v1 describe",
        link: "v1link.com",
        tag: "Tag1",
      },
    ]);
  });
});

// **************** get

describe("get", function () {
  test("works", async function () {
    let video = await Video.get(testVideoIds[0]);
    expect(video).toEqual({
      id: testVideoIds[0],
      name: "v1",
      description: "v1 describe",
      link: "v1link.com",
      tags: [{ tag_id: testTagIds[0], tag_name: "Tag1" }],
    });
  });

  test("not found if no such video", async function () {
    try {
      await Video.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

// ***************** update

describe("update", function () {
  let updateData = {
    name: "v1update",
    description: "v1update des",
    link: "v1updatelink.com",
  };

  test("works", async function () {
    let video = await Video.update(testVideoIds[0], updateData);
    expect(video).toEqual({
      id: testVideoIds[0],
      ...updateData,
    });

    const result = await db.query(
      `
      SELECT id, name, description, link
      FROM videos
      WHERE id = $1
      `,
      [testVideoIds[0]]
    );

    expect(result.rows).toEqual([
      {
        id: testVideoIds[0],
        name: "v1update",
        description: "v1update des",
        link: "v1updatelink.com",
      },
    ]);
  });

  test("works: null fields", async function () {
    let updateDataSetNulls = {
      name: "v1update",
      description: null,
      link: "v1update.com",
    };

    let video = await Video.update(testVideoIds[0], updateDataSetNulls);
    expect(video).toEqual({
      id: testVideoIds[0],
      ...updateDataSetNulls,
    });
  });

  test("not found if no such video", async function () {
    try {
      await Video.update(0, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Video.update(testVideoIds[0], {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

// ************* remove

describe("remove", function () {
  test("works", async function () {
    await Video.remove(testVideoIds[0]);
    const res = await db.query("SELECT id FROM videos WHERE id = $1", [
      testVideoIds[0],
    ]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such video", async function () {
    try {
      await Video.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

// ************* addVideoTag

describe("addVideoTag", function () {
  test("works", async function () {
    const tagData = { video_id: testVideoIds[2], tag_id: testTagIds[0] };
    await Video.addVideoTag(tagData);

    const res = await db.query(
      "SELECT * FROM videos_tags WHERE video_id = $1 AND tag_id = $2",
      [testVideoIds[2], testTagIds[0]]
    );
    expect(res.rows[0]).toEqual({
      video_id: expect.any(Number),
      tag_id: testTagIds[0],
    });
  });
});

// ************ removeVideoTag

describe("removeVideoTag", function () {
  test("works", async function () {
    const tagData = { video_id: testVideoIds[0], tag_id: testTagIds[0] };
    await Video.removeVideoTag(tagData);
    const res = await db.query(
      `SELECT video_id, tag_id FROM videos_tags WHERE video_id = $1 AND tag_id = $2`,
      [testVideoIds[0], testTagIds[0]]
    );
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such video_tag", async function () {
    try {
      await Video.removeVideoTag(0, 0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
