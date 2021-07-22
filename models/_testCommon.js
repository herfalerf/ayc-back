const db = require("../db.js");

const testMemberIds = [];

async function commonBeforeAll() {
  await db.query("DELETE FROM team");

  const resultsTeam = await db.query(`
    INSERT INTO team(name, bio, img)
    VALUES ('Team Member', 'Team Member Bio', 'https://via.placeholder.com/150')
    `);

  testMemberIds.splice(0, 0, ...resultsTeam.rows.map((r) => r.id));
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
