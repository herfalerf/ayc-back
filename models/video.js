"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Video {
  // Create a video (from data), update db, return new job data.
  //
  // data should be { name, description, link }
  //
  // Returns { id, name description, link }

  static async create({ name, description, link }) {
    const duplicateCheck = await db.query(
      `SELECT name
             FROM videos
             WHERE name = $1`,
      [name]
    );

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate video name: ${name}`);

    const result = await db.query(
      `INSERT INTO videos
                 (name, description, link)
                 VALUES ($1, $2, $3)
                 RETURNING id, name, description, link`,
      [name, description, link]
    );

    let video = result.rows[0];

    return video;
  }

  // Find a list of videos
  //
  // Returns [{id, name, description, link}, ...videos]
  static async findAll() {
    let query = `SELECT
                   id, 
                   name, 
                   description,
                   link
                   FROM videos`;
    const videosRes = await db.query(query);
    return videosRes.rows;
  }

  //  Find a specific video from id
  //
  // returns video { id, name, description, link }
  static async get(id) {
    const videoRes = await db.query(
      `SELECT id,
                  name,
                  description,
                  link
                  FROM videos
                  WHERE id = $1`,
      [id]
    );

    const video = videoRes.rows[0];
    if (!video) throw new NotFoundError(`No video with id: ${id}`);
    return video;
  }

  //  Update video with data
  //
  // Data should be { name, description, link } with all inputs being optional
  //
  // returns video { id, name, description, link }
  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE videos
                        SET ${setCols}
                        WHERE id = ${idVarIdx}
                        RETURNING id, 
                                  name,
                                  description,
                                  link`;
    const result = await db.query(querySql, [...values, id]);
    const video = result.rows[0];

    if (!video) throw new NotFoundError(`No video with id: ${id}`);

    return video;
  }

  //  Remove video from the database by id

  static async remove(id) {
    const result = await db.query(
      `DELETE
           FROM videos
           WHERE id = $1
           RETURNING id`,
      [id]
    );

    const video = result.rows[0];

    if (!video) throw new NotFoundError(`No video with id: ${id}`);
  }
}

module.exports = Video;
