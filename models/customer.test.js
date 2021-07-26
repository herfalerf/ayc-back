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
  testCustomerIds,
} = require("./_testCommon");
const { fail } = require("assert");
const Customer = require("./customer");
const { JsonWebTokenError } = require("jsonwebtoken");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// *************CREATE
describe("add", function () {
  const newCustomer = {
    name: "New Customer",
    email: "test@test.com",
    phone: "999-999-9999",
    company: "Test Company",
  };

  test("works", async function () {
    let customer = await Customer.add(newCustomer);
    expect(customer).toEqual({
      id: expect.any(Number),
      ...newCustomer,
    });

    const result = await db.query(
      `SELECT id, name, email, phone, company
        FROM customers
        WHERE email = 'test@test.com'`
    );

    expect(result.rows).toEqual([
      {
        id: expect.any(Number),
        name: "New Customer",
        email: "test@test.com",
        phone: "999-999-9999",
        company: "Test Company",
      },
    ]);
  });

  test("bad request with dupe", async function () {
    try {
      await Customer.add(newCustomer);
      await Customer.add(newCustomer);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

describe("findAll", function () {
  test("works", async function () {
    let customers = await Customer.findAll();
    expect(customers).toEqual([
      {
        id: expect.any(Number),
        name: "Test Cust",
        email: "testemail@email.com",
        phone: "111-111-1111",
        company: "Test Company",
      },
      {
        id: expect.any(Number),
        name: "Test Cust2",
        email: "testemail2@email.com",
        phone: "222-222-2222",
        company: "Test Company 2",
      },
    ]);
  });
});
