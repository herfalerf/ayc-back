"use strict";

const db = require("../db");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

class Member {
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

  static async findAll() {
    const result = await db.query(
      `SELECT name,
            bio,
            img
            FROM team
            ORDER BY name`
    );

    return result.rows;
  }

  static async get(name) {
    const memberRes = await db.query(
      `SELECT name,
            bio,
            img
            FROM team
            WHERE name= $1`,
      [name]
    );

    const member = memberRes.rows[0];

    if (!member) throw new NotFoundError(`No team member: ${name}`);
  }
}

module.exports = Member;
