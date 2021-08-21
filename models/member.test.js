"use strict";

const { NotFoundError, BadRequestError } = require("../expressError");
const db = require("../db.js");
const Member = require("./member.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testTeamIds,
} = require("./_testCommon");
const { fail } = require("assert");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// ************ Add

describe("add", function () {
  const newMember = {
    name: "Test",
    title: "Test",
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
        title: "Member Title",
        bio: "Team Member Bio",
        img: "https://via.placeholder.com/150",
      },
      {
        id: expect.any(Number),
        name: "Team Member 2",
        title: "Member Title 2",
        bio: "Team Member Bio 2",
        img: "https://via.placeholder.com/150",
      },
    ]);
  });
});

// ************** get

describe("get", function () {
  test("works", async function () {
    let member = await Member.get(testTeamIds[0]);
    expect(member).toEqual({
      id: testTeamIds[0],
      name: "Team Member",
      title: "Member Title",
      bio: "Team Member Bio",
      img: "https://via.placeholder.com/150",
    });
  });

  test("not found if no such team member", async function () {
    try {
      await Member.get(0);
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
    title: "Update",
    bio: "Update",
    img: null,
  };

  test("works", async function () {
    let member = await Member.update(testTeamIds[0], updateData);
    expect(member).toEqual({
      id: testTeamIds[0],
      name: "Team Member",
      title: "Member Title",
      img: "https://via.placeholder.com/150",
      ...updateData,
    });

    const result = await db.query(
      `SELECT id, name, title, bio, img FROM team WHERE name = 'Team Member'`
    );
    expect(result.rows).toEqual([
      {
        id: testTeamIds[0],
        name: "Team Member",
        title: "Member Title",
        bio: "Update Bio",
        img: "https://via.placeholder.com/150",
      },
    ]);
  });

  test("works: null fields", async function () {
    let member = await Member.update(testTeamIds[0], updateDataSetNulls);
    expect(member).toEqual({
      id: testTeamIds[0],

      ...updateDataSetNulls,
    });

    const result = await db.query(
      `SELECT id, name, bio, img FROM team WHERE name = 'Update'`
    );
    expect(result.rows).toEqual([
      {
        id: testTeamIds[0],
        name: "Update",
        bio: "Update",
        img: null,
      },
    ]);
  });

  test("not found if no such member", async function () {
    try {
      await Member.update(0, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Member.update(testTeamIds[0], {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

// ************** remove

describe("remove", function () {
  test("works", async function () {
    await Member.remove(testTeamIds[0]);
    const res = await db.query(
      "SELECT name FROM team WHERE name='Team Member'"
    );
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such member", async function () {
    try {
      await Member.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
