const db = require("../db");
const Member = require("../models/member");

async function commonBeforeAll() {
  await db.query("DELETE FROM team");

  await Member.addMember({
    name: "Team Member",
    bio: "team member bio",
    img: "https://via.placeholder.com/150",
  });
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
};
