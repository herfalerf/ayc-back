const db = require("../db");
const Member = require("../models/member");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");
const { createToken } = require("../helpers/tokens");

async function commonBeforeAll() {
  await db.query("DELETE FROM team");

  await Member.addMember({
    name: "Team Member",
    bio: "Team member bio",
    img: "https://via.placeholder.com/150",
  });
  await Member.addMember({
    name: "Team Member 2",
    bio: "Team member bio 2",
    img: "https://via.placeholder.com/150",
  });

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
};
