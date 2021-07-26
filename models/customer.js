"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

// Related functions for customers.

class Customer {
  // Create a customer (from data), update db, return new customer data.
  //
  // data should be { name, email, phone, company }
  //
  // Returns { id, name, email, phone, company }
  // Throws BadRequestError if email already in database.

  static async add({ name, email, phone, company }) {
    const duplicateCheck = await db.query(
      `SELECT email
            FROM customers
            WHERE email = $1`,
      [email]
    );

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Email already exists: ${email}`);

    const result = await db.query(
      `INSERT INTO customers
        (name, email, phone, company)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, phone, company`,
      [name, email, phone, company]
    );
    const customer = result.rows[0];

    return customer;
  }

  static async findAll() {
    const query = `
    SELECT id, name, email, phone, company
    FROM customers`;

    const customerRes = await db.query(query);
    return customerRes.rows;
  }
}

module.exports = Customer;
