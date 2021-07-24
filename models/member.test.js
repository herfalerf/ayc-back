"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const Member = require("./member.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds,
} = require("./_testCommon");
const { ExpectationFailed } = require("http-errors");
const { fail } = require("assert");
const { compareSync } = require("bcrypt");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// ************ Add

describe("add", function () {
  const newMember = {
    name: "Test",
    bio: "Test Bio",
    img: "Test img",
  };

  test("works", async function () {
    let member = await Member.addMember(newMember);
    expect(member).toEqual({ id: expect.any(Number), ...newMember });
    const found = await db.query("SELECT * FROM team WHERE name = 'Test'");
    expect(found.rows.length).toEqual(1);
  });
});

// ************** findAll

describe("findAll", function () {
  test("works", async function () {
    let team = await Member.findAll();
    expect(team).toEqual([
      {
        id: expect.any(Number),
        name: "Team Member",
        bio: "Team Member Bio",
        img: "https://via.placeholder.com/150",
      },
      {
        id: expect.any(Number),
        name: "Team Member 2",
        bio: "Team Member Bio 2",
        img: "https://via.placeholder.com/150",
      },
    ]);
  });
});

// ************** get

describe("get", function () {
  test("works", async function () {
    let member = await Member.get("Team Member");
    expect(member).toEqual({
      id: expect.any(Number),
      name: "Team Member",
      bio: "Team Member Bio",
      img: "https://via.placeholder.com/150",
    });
  });

  test("not found if no such team member", async function () {
    try {
      await Member.get("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

// ************* update

describe("update", function () {
  const updateData = {
    bio: "Update Bio",
  };
  const updateDataSetNulls = {
    name: "Update",
    bio: "Update",
    img: null,
  };

  test("works", async function () {
    let member = await Member.update("Team Member", updateData);
    expect(member).toEqual({
      id: expect.any(Number),
      name: "Team Member",
      img: "https://via.placeholder.com/150",
      ...updateData,
    });

    const result = await db.query(
      `SELECT id, name, bio, img FROM team WHERE name = 'Team Member'`
    );
    expect(result.rows).toEqual([
      {
        id: expect.any(Number),
        name: "Team Member",
        bio: "Update Bio",
        img: "https://via.placeholder.com/150",
      },
    ]);
  });

  test("works: null fields", async function () {
    let member = await Member.update("Team Member", updateDataSetNulls);
    expect(member).toEqual({
      id: expect.any(Number),

      ...updateDataSetNulls,
    });

    const result = await db.query(
      `SELECT id, name, bio, img FROM team WHERE name = 'Update'`
    );
    expect(result.rows).toEqual([
      {
        id: expect.any(Number),
        name: "Update",
        bio: "Update",
        img: null,
      },
    ]);
  });

  test("not found if no such member", async function () {
    try {
      await Member.update("nope", updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Member.update("Team Member", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

// ************** remove

describe("remove", function () {
  test("works", async function () {
    await Member.remove("Team Member");
    const res = await db.query(
      "SELECT name FROM team WHERE name='Team Member'"
    );
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such member", async function () {
    try {
      await Member.remove("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
