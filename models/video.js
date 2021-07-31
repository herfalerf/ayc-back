"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Video {
  // Add a video (from data), update db, return new job data.
  //
  // data should be { name, description, link }
  //
  // Returns { id, name description, link }

  static async add({ name, description, link }) {
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
  static async findAll(tag) {
    let query = "";
    if (tag) {
      query = `SELECT videos.id, videos.name, videos.link, videos.description, tags.name as tag FROM videos JOIN videos_tags ON videos.id = videos_tags.video_id JOIN tags ON videos_tags.tag_id = tags.id WHERE tags.name = '${tag}'`;
    } else {
      query = `SELECT
                   id, 
                   name, 
                   description,
                   link
                   FROM videos`;
    }

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

    const videoTagsRes = await db.query(
      `SELECT vt.tag_id, tags.name AS tag_name
         FROM videos_tags AS vt
         JOIN tags ON vt.tag_id = tags.id
         WHERE vt.video_id = $1`,
      [id]
    );

    video.tags = videoTagsRes.rows.map((t) => t.tag_name);
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

  static async addVideoTag({ video_id, tag_id }) {
    const preCheck = await db.query(
      `SELECT id 
           FROM tags
           WHERE id = $1`,
      [tag_id]
    );
    const tag = preCheck.rows[0];

    if (!tag) throw new NotFoundError(`No tag with id: ${tag_id}`);

    const preCheck2 = await db.query(
      `SELECT id
           FROM videos
           WHERE id = $1`,
      [video_id]
    );
    const video = preCheck2.rows[0];

    if (!video) throw new NotFoundError(`No video with id: ${video_id}`);

    const result = await db.query(
      `INSERT INTO videos_tags (video_id, tag_id)
         VALUES ($1, $2)
         RETURNING video_id, tag_id`,
      [video_id, tag_id]
    );

    const videoTag = result.rows[0];
    return videoTag;
  }

  static async removeVideoTag(video_id, tag_id) {
    const result = await db.query(
      `DELETE 
           FROM videos_tags
           WHERE video_id = $1 AND tag_id = $2
           RETURNING video_id, tag_id`,
      [video_id, tag_id]
    );

    if (!result.rows[0])
      throw new NotFoundError(
        `No tag id of: ${tag_id} on video with id: ${video_id}`
      );
  }
}

module.exports = Video;
