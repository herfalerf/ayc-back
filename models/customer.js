"use strict";

const { NotFound } = require("http-errors");
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

  // Find a list of all customers
  //
  // Returns returns list of all members [{ id, name, email, phone, company }, ...]
  static async findAll() {
    const query = `
    SELECT id, name, email, phone, company
    FROM customers`;

    const customerRes = await db.query(query);
    return customerRes.rows;
  }

  // Finds a customer by name
  //
  // Accepts customer name as argument
  //
  // returns list of customers with the name searched for [{ id, name, email, phone, compnay }, { customer2 }, ...]
  //
  // Throws not found error if customer is not found

  static async get(id) {
    const customerRes = await db.query(
      `
      SELECT id,
      name, 
      email, 
      phone, 
      company
      FROM customers
      WHERE id = $1
      `,
      [id]
    );

    if (!customerRes.rows[0])
      throw new NotFoundError(`No customer with id: ${id}`);

    return customerRes.rows[0];
  }

  // Updates customer information based on email address.
  //
  // Accepts customer email and data to be updated.
  // Data can include: { name, email, phone, company }
  //
  // Returns updated customer information { id, name, email, phone, company }
  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE customers
                      SET ${setCols}
                      WHERE id = ${idVarIdx}
                      RETURNING id,
                                name,
                                email,
                                phone,
                                company`;
    const result = await db.query(querySql, [...values, id]);
    const customer = result.rows[0];

    if (!customer) throw new NotFoundError(`No customer with id: ${id}`);

    return customer;
  }

  // Removes customer based on email address
  //
  // Accepts customer email as argument
  //
  // Returns customer email

  static async remove(id) {
    const result = await db.query(
      `DELETE
       FROM customers
       WHERE id = $1
       RETURNING id`,
      [id]
    );

    const customer = result.rows[0];

    if (!customer) throw new NotFoundError(`No customer with id: ${id}`);

    return customer;
  }
}

module.exports = Customer;
