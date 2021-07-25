"use strict";

const { UnauthorizedError } = require("../expressError");
const Admin = require("./admin.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");
const { fail } = require("assert");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// Authenticate

describe("authenticate", function () {
  test("works", async function () {
    const admin = await Admin.authenticate("a1", "password1");
    expect(admin).toEqual({
      username: "a1",
    });
  });

  test("unauth if no such user", async function () {
    try {
      await Admin.authenticate("nope", "password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauth if wrong password", async function () {
    try {
      await Admin.authenticate("a1", "wrong");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});
