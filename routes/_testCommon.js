const db = require("../db");

const Member = require("../models/member");
const Customer = require("../models/customer");
const Video = require("../models/video");
const Tag = require("../models/tag");

const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");
const { createToken } = require("../helpers/tokens");

const testCustomerIds = [];
const testVideoIds = [];
const testTagIds = [];
const testTeamIds = [];

async function commonBeforeAll() {
  await db.query("DELETE FROM team");
  await db.query("DELETE FROM customers");
  await db.query("DELETE FROM videos");
  await db.query("DELETE FROM tags");
  await db.query("DELETE FROM videos_tags");

  testTeamIds[0] = (
    await Member.addMember({
      name: "Team Member",
      title: "Member Title",
      bio: "Team member bio",
      img: "https://via.placeholder.com/150",
    })
  ).id;

  testTeamIds[1] = (
    await Member.addMember({
      name: "Team Member 2",
      title: "Member Title 2",
      bio: "Team member bio 2",
      img: "https://via.placeholder.com/150",
    })
  ).id;

  testCustomerIds[0] = (
    await Customer.add({
      name: "Test1",
      email: "test1@email.com",
      phone: "111",
      company: "test1",
    })
  ).id;
  testCustomerIds[1] = (
    await Customer.add({
      name: "Test2",
      email: "test2@email.com",
      phone: "222",
      company: "test2",
    })
  ).id;

  testVideoIds[0] = (
    await Video.add({
      name: "Test1",
      description: "Description1",
      link: "link1.com",
    })
  ).id;

  testVideoIds[1] = (
    await Video.add({
      name: "Test2",
      description: "Description2",
      link: "link2.com",
    })
  ).id;

  testTagIds[0] = (
    await Tag.add({
      name: "Tag1",
    })
  ).id;

  testTagIds[1] = (
    await Tag.add({
      name: "Tag2",
    })
  ).id;

  await db.query(
    `INSERT INTO videos_tags (video_id, tag_id)
      VALUES (${testVideoIds[0]}, ${testTagIds[0]}),
             (${testVideoIds[1]}, ${testTagIds[1]})`
  );

  await db.query(
    `INSERT INTO admins(username, password)
          VALUES ('a1', $1),
                 ('a2', $2)
          RETURNING username`,
    [
      await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
    ]
  );
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

const a1Token = createToken({ username: "a1" });
const a2Token = createToken({ username: "a2" });

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  a1Token,
  a2Token,
  testCustomerIds,
  testVideoIds,
  testTagIds,
  testTeamIds,
};
