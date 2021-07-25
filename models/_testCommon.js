const bcrypt = require("bcrypt");
const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

const testMemberIds = [];

async function commonBeforeAll() {
  await db.query("DELETE FROM team");

  const resultsTeam = await db.query(`
    INSERT INTO team(name, bio, img)
    VALUES ('Team Member', 'Team Member Bio', 'https://via.placeholder.com/150'),
           ('Team Member 2', 'Team Member Bio 2', 'https://via.placeholder.com/150')
    `);

  testMemberIds.splice(0, 0, ...resultsTeam.rows.map((r) => r.id));

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

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testMemberIds,
};
