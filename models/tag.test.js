"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const Tag = require("./tag.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testTagIds,
} = require("./_testCommon");
const { fail } = require("assert");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// *********** ADD
describe("add", function () {
  const newTag = {
    name: "New Tag",
  };

  test("works", async function () {
    let tag = await Tag.add(newTag);
    expect(tag).toEqual({
      id: expect.any(Number),
      ...newTag,
    });

    const result = await db.query(
      `SELECT id, name FROM tags WHERE name = 'New Tag'`
    );

    expect(result.rows).toEqual([
      {
        id: expect.any(Number),
        name: "New Tag",
      },
    ]);
  });

  test("bad request with dupe", async function () {
    try {
      await Tag.add(newTag);
      await Tag.add(newTag);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

// ****************** findAll

describe("findAll", function () {
  test("works", async function () {
    let tags = await Tag.findAll();
    expect(tags).toEqual([
      {
        id: expect.any(Number),
        name: "Tag1",
      },
      {
        id: expect.any(Number),
        name: "Tag2",
      },
      {
        id: expect.any(Number),
        name: "Tag3",
      },
    ]);
  });
});

// ****************** get

describe("get", function () {
  test("works", async function () {
    let tag = await Tag.get(testTagIds[0]);
    expect(tag).toEqual({
      id: testTagIds[0],
      name: "Tag1",
    });
  });

  test("not found if no such tag", async function () {
    try {
      await Tag.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

// *************** update

describe("update", function () {
  let updateData = "New Name";
  test("works", async function () {
    let tag = await Tag.update(testTagIds[0], updateData);
    expect(tag).toEqual({
      id: testTagIds[0],
      name: "New Name",
    });

    const result = await db.query(
      `SELECT id, name FROM tags WHERE name = 'New Name'`
    );
    expect(result.rows[0]).toEqual({
      id: testTagIds[0],
      name: "New Name",
    });
  });

  test("not found if no such tag", async function () {
    try {
      await Tag.update(0, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Tag.update(testTagIds[0]);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

// ************** remove

describe("remove", function () {
  test("works", async function () {
    await Tag.remove(testTagIds[0]);
    const res = await db.query("SELECT name FROM tags WHERE name='Tag1'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such tag", async function () {
    try {
      await Tag.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
