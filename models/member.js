"use strict";

const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const { sqlForPartialUpdate } = require("../helpers/sql");

// Related functions for team members.
class Member {
  //  Add new member to database.
  //   Data should be { name, bio, img }
  //  returns { id, name, bio, img }
  static async addMember({ name, bio, img }) {
    const duplicateCheck = await db.query(
      `SELECT name
                FROM team
                WHERE name =$1`,
      [name]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate Name: ${name}`);
    }

    const result = await db.query(
      `INSERT INTO team
                (name,
                bio,
                img)
                VALUES ($1, $2, $3)
                RETURNING id, name, bio, img`,
      [name, bio, img]
    );

    const member = result.rows[0];
    return member;
  }

  //   Find all members
  //  Returns array of all members [{ id, name, bio, img}, ...]
  static async findAll() {
    const result = await db.query(
      `SELECT 
            id,
            name,
            bio,
            img
            FROM team
            ORDER BY name`
    );

    return result.rows;
  }

  //   Get member by name
  // accepts member name as function argument
  // returns { id, name, bio, img }
  // throws NotFoundError if member not found.
  static async get(name) {
    const memberRes = await db.query(
      `SELECT id,
            name,
            bio,
            img
            FROM team
            WHERE name= $1`,
      [name]
    );

    const member = memberRes.rows[0];

    if (!member) throw new NotFoundError(`No team member: ${name}`);
    return member;
  }

  //   Update member with 'data'
  // This is a partial update, not all fields are required, it will only change the provided fields
  // Data can include: { name, bio, img }
  // returns: { id, name, bio, img }
  // Throws NotFoundError if member not found.

  static async update(name, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      name: "name",
      bio: "bio",
      img: "img",
    });
    const handleVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE team
                        SET ${setCols}
                        WHERE name = ${handleVarIdx}
                        RETURNING id,
                                  name, 
                                  bio,
                                  img`;
    const result = await db.query(querySql, [...values, name]);
    const member = result.rows[0];

    if (!member) throw new NotFoundError(`No team member: ${name}`);

    return member;
  }

  //    Delete member from database
  //   returns undefined/
  // Throws NotFoundError if member not found.

  static async remove(name) {
    const result = await db.query(
      `DELETE
             FROM team
             WHERE name = $1
             RETURNING name`,
      [name]
    );
    const member = result.rows[0];

    if (!member) throw new NotFoundError(`No team member: ${name}`);
  }
}

module.exports = Member;
