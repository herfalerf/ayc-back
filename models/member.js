"use strict";

const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

// Related functions for team members.
class Member {
  //  Add new member to database.
  //   Data should be { name, bio, img }
  //  returns { id, name, bio, img }
  static async addMember({ name, title, bio, img }) {
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
                title,
                bio,
                img)
                VALUES ($1, $2, $3, $4)
                RETURNING id, name, title, bio, img`,
      [name, title, bio, img]
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
            title,
            bio,
            img
            FROM team
            ORDER BY id`
    );

    return result.rows;
  }

  //   Get member by name
  // accepts member name as function argument
  // returns { id, name, bio, img }
  // throws NotFoundError if member not found.
  static async get(id) {
    const memberRes = await db.query(
      `SELECT id,
            name,
            title,
            bio,
            img
            FROM team
            WHERE id= $1`,
      [id]
    );

    const member = memberRes.rows[0];

    if (!member) throw new NotFoundError(`No team member with id: ${id}`);
    return member;
  }

  //   Update member with 'data'
  // This is a partial update, not all fields are required, it will only change the provided fields
  // Data can include: { name, bio, img }
  // returns: { id, name, bio, img }
  // Throws NotFoundError if member not found.

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      name: "name",
      title: "title",
      bio: "bio",
      img: "img",
    });
    const handleVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE team
                        SET ${setCols}
                        WHERE id = ${handleVarIdx}
                        RETURNING id,
                                  name,
                                  title, 
                                  bio,
                                  img`;
    const result = await db.query(querySql, [...values, id]);
    const member = result.rows[0];

    if (!member) throw new NotFoundError(`No team member id: ${id}`);

    return member;
  }

  //    Delete member from database
  //   returns undefined/
  // Throws NotFoundError if member not found.

  static async remove(id) {
    const result = await db.query(
      `DELETE
             FROM team
             WHERE id = $1
             RETURNING id`,
      [id]
    );
    const member = result.rows[0];

    if (!member) throw new NotFoundError(`No team member with id: ${id}`);

    return member;
  }
}

module.exports = Member;
