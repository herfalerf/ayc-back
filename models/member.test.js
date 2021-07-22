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

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

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
