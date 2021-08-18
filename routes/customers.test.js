"use strict";
const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const Customer = require("../models/customer");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  a1Token,
  a2Token,
  testCustomerIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// POST /customers

describe("POST /customers", function () {
  test("works", async function () {
    const resp = await request(app)
      .post("/customers")
      .send({
        name: "New Cust",
        email: "new@email.com",
        phone: "111-111-1111",
        company: "Newcorp",
      })
      .set("authorization", `Bearer ${a1Token}`);

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      customer: {
        id: expect.any(Number),
        name: "New Cust",
        email: "new@email.com",
        phone: "111-111-1111",
        company: "Newcorp",
      },
    });
  });

  test("works with partial data", async function () {
    const resp = await request(app)
      .post("/customers")
      .send({
        name: "New Cust",
        email: "new@email.com",
        phone: "111-111-1111",
      })
      .set("authorization", `Bearer ${a1Token}`);

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      customer: {
        id: expect.any(Number),
        name: "New Cust",
        email: "new@email.com",
        phone: "111-111-1111",
        company: null,
      },
    });
  });

  test("bad request with incorrect properties", async function () {
    const resp = await request(app)
      .post("/customers")
      .send({
        name: "New Cust",
        email: "new@email.com",
        phone: "111-111-1111",
        company: "Newcorp",
        bio: "new customer bio",
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

  test("bad request with no email", async function () {
    const resp = await request(app)
      .post("/customers")
      .send({
        name: "New Cust",
        phone: "111-111-1111",
        company: "Newcorp",
      })
      .set("authorization", `Bearer ${a1Token}`);

    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      error: {
        message: ['instance requires property "email"'],
        status: 400,
      },
    });
  });
});

// GET /customer

describe("GET /customer", function () {
  test("works", async function () {
    const resp = await await request(app)
      .get("/customers")
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.body).toEqual({
      customers: [
        {
          id: expect.any(Number),
          name: "Test1",
          email: "test1@email.com",
          phone: "111",
          company: "test1",
        },
        {
          id: expect.any(Number),
          name: "Test2",
          email: "test2@email.com",
          phone: "222",
          company: "test2",
        },
      ],
    });
  });

  test("Unauthorized with no token", async function () {
    const resp = await await request(app).get("/customers");
    expect(resp.statusCode).toEqual(401);
  });
});

// GET /customers/:id

describe("GET /customers/:id", function () {
  test("works", async function () {
    const resp = await request(app)
      .get(`/customers/${testCustomerIds[0]}`)
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.body).toEqual({
      customer: {
        id: testCustomerIds[0],
        name: "Test1",
        email: "test1@email.com",
        phone: "111",
        company: "test1",
      },
    });
  });

  test("not found for no such customer id", async function () {
    const resp = await request(app)
      .get("/customers/0")
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("Unauthorized with no token", async function () {
    const resp = await request(app).get(`/customers/${testCustomerIds[0]}`);
    expect(resp.statusCode).toEqual(401);
  });
});

// PATCH /customers/:id

describe("PATCH /customers/:id", function () {
  test("works", async function () {
    const resp = await request(app)
      .patch(`/customers/${testCustomerIds[0]}`)
      .send({
        name: "New Name",
      })
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.body).toEqual({
      customer: {
        id: testCustomerIds[0],
        name: "New Name",
        email: "test1@email.com",
        phone: "111",
        company: "test1",
      },
    });
  });

  test("bad request with incorrect properties", async function () {
    const resp = await request(app)
      .patch(`/customers/${testCustomerIds[0]}`)
      .send({
        name: "New Name",
        bio: "new customer bio",
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

  test("not found on no such customer id", async function () {
    const resp = await request(app)
      .patch(`/customers/0`)
      .send({
        name: "New Nope",
      })
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("Unathorized with no token", async function () {
    const resp = await request(app)
      .patch(`/customers/${testCustomerIds[0]}`)
      .send({
        name: "New Name",
      });
    expect(resp.statusCode).toEqual(401);
  });
});

// DELETE /customers/:id

describe("DELETE /customers/:id", function () {
  test("works", async function () {
    const resp = await request(app)
      .delete(`/customers/${testCustomerIds[0]}`)
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.body).toEqual({
      deleted: `Customer with id: ${testCustomerIds[0]}`,
    });
  });

  test("not found for no such customer id", async function () {
    const resp = await request(app)
      .delete(`/customers/0`)
      .set("authorization", `Bearer ${a1Token}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("Unauthorized with no token", async function () {
    const resp = await request(app).delete(`/customers/${testCustomerIds[0]}`);
    expect(resp.statusCode).toEqual(401);
  });
});
