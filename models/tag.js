"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Tag {
  // Add a tag (from data), update db, return new tag data.
  //
  // data should be { name }
  //
  // Returns { id, name }

  static async add({ name }) {
    const duplicateCheck = await db.query(
      `SELECT name 
             FROM tags
             WHERE name = $1`,
      [name]
    );

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Tag: ${name} already exists.`);

    const result = await db.query(
      `INSERT INTO tags
         (name)
         VALUES ($1)
         RETURNING id, name`,
      [name]
    );
    let tag = result.rows[0];

    return tag;
  }

  static async findAll() {
    const tagsRes = await db.query(`SELECT 
                                     id,
                                     name
                                     FROM tags`);

    return tagsRes.rows;
  }

  static async get(id) {
    const tagRes = await db.query(
      `SELECT id,
          name
          FROM tags
          WHERE id = $1`,
      [id]
    );

    const tag = tagRes.rows[0];

    if (!tag) throw new NotFoundError(`No tag with id: ${id}`);

    return tag;
  }

  static async update(id, newName) {
    if (!newName) throw new BadRequestError("No data");
    const tagRes = await db.query(
      `UPDATE tags
                        SET name = $2
                        WHERE id = $1
                        RETURNING id,
                        name`,
      [id, newName]
    );

    const tag = tagRes.rows[0];

    if (!tag) throw new NotFoundError(`No tag with id: ${id}`);

    return tag;
  }

  static async remove(id) {
    const result = await db.query(
      `DELETE FROM tags WHERE id = $1 RETURNING id`,
      [id]
    );

    const tag = result.rows[0];
    if (!tag) throw new NotFoundError(`No tag with id: ${id}`);
    return tag;
  }
}

module.exports = Tag;
