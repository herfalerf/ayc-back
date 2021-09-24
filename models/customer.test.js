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
const { NotFound } = require("http-errors");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// *************add

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

// ****************findAll

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

// ***************get

describe("get", function () {
  test("works", async function () {
    let customers = await Customer.get(testCustomerIds[0]);
    expect(customers).toEqual({
      id: testCustomerIds[0],
      name: "Test Cust",
      email: "testemail@email.com",
      phone: "111-111-1111",
      company: "Test Company",
    });
  });

  //   test("works with duplicate names", async function () {
  //     const newCustomer = {
  //       name: "Test Cust",
  //       email: "test@test.com",
  //       phone: "999-999-9999",
  //       company: "Test Company",
  //     };

  //     await Customer.add(newCustomer);

  //     let customers = await Customer.get("Test Cust");
  //     expect(customers).toEqual([
  //       {
  //         id: expect.any(Number),
  //         name: "Test Cust",
  //         email: "testemail@email.com",
  //         phone: "111-111-1111",
  //         company: "Test Company",
  //       },
  //       {
  //         id: expect.any(Number),
  //         name: "Test Cust",
  //         email: "test@test.com",
  //         phone: "999-999-9999",
  //         company: "Test Company",
  //       },
  //     ]);
  //   });

  test("not found if no such customer", async function () {
    try {
      await Customer.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

// *****************update

describe("update", function () {
  let updateData = {
    name: "Update Cust",
    email: "updateemail@email.com",
    phone: "333-333-33333",
    company: "Update Company",
  };

  let partialUpdateData = {
    name: "Update Cust",
    email: "updateemail@email.com",
  };

  test("works", async function () {
    let customer = await Customer.update(testCustomerIds[0], updateData);
    expect(customer).toEqual({
      id: testCustomerIds[0],
      ...updateData,
    });

    const result = await db.query(`
      SELECT id, name, email, phone, company
      FROM customers
      WHERE id = ${testCustomerIds[0]}
      `);

    expect(result.rows).toEqual([
      {
        id: testCustomerIds[0],
        name: "Update Cust",
        email: "updateemail@email.com",
        phone: "333-333-33333",
        company: "Update Company",
      },
    ]);
  });

  test("works: partial update", async function () {
    let customer = await Customer.update(testCustomerIds[0], partialUpdateData);
    expect(customer).toEqual({
      id: testCustomerIds[0],
      phone: "111-111-1111",
      company: "Test Company",
      ...partialUpdateData,
    });
    const result = await db.query(`
    SELECT id, name, email, phone, company
    FROM customers
    WHERE id = ${testCustomerIds[0]}
    `);

    expect(result.rows).toEqual([
      {
        id: testCustomerIds[0],
        name: "Update Cust",
        email: "updateemail@email.com",
        phone: "111-111-1111",
        company: "Test Company",
      },
    ]);
  });

  test("works: null fields", async function () {
    let updateDataSetNulls = {
      name: null,
      email: "testemail@email.com",
      phone: null,
      company: null,
    };

    let customer = await Customer.update(
      testCustomerIds[0],
      updateDataSetNulls
    );
    expect(customer).toEqual({
      id: testCustomerIds[0],
      ...updateDataSetNulls,
    });
  });

  test("not found if no such customer", async function () {
    try {
      await Customer.update(0, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Customer.update(testCustomerIds[0], {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("bad request with duplicate email", async function () {
    try {
      await Customer.update(testCustomerIds[0], {
        name: "Update Cust",
        email: "testemail2@email.com",
        phone: "333-333-33333",
        company: "Update Company",
      });
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

describe("remove", function () {
  test("works", async function () {
    await Customer.remove(testCustomerIds[0]);
    const res = await db.query(
      `SELECT id FROM customers WHERE id ='${testCustomerIds[0]}'`
    );
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such customer", async function () {
    try {
      await Customer.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
