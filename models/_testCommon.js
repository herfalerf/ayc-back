const bcrypt = require("bcrypt");
const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

const testTagIds = [];
const testVideoIds = [];
const testCustomerIds = [];
const testTeamIds = [];

async function commonBeforeAll() {
  await db.query("DELETE FROM team");
  await db.query("DELETE FROM customers");
  await db.query("DELETE FROM tags");
  await db.query("DELETE FROM admins");
  await db.query("DELETE FROM videos");

  const resultsCustomers = await db.query(`
  INSERT INTO customers(name, email, phone, company)
  VALUES ('Test Cust', 'testemail@email.com', '111-111-1111', 'Test Company'),
         ('Test Cust2', 'testemail2@email.com', '222-222-2222', 'Test Company 2')
  RETURNING id`);

  testCustomerIds.splice(0, 0, ...resultsCustomers.rows.map((r) => r.id));

  const resultsTeam = await db.query(`
    INSERT INTO team(name, title, bio, img)
    VALUES ('Team Member', 'Member Title', 'Team Member Bio', 'https://via.placeholder.com/150'),
           ('Team Member 2', 'Member Title 2', 'Team Member Bio 2', 'https://via.placeholder.com/150')
    RETURNING id`);

  testTeamIds.splice(0, 0, ...resultsTeam.rows.map((r) => r.id));

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

  const resultsTags = await db.query(`
  INSERT INTO tags(name)
  VALUES ('Tag1'), ('Tag2'), ('Tag3') 
  RETURNING id`);

  testTagIds.splice(0, 0, ...resultsTags.rows.map((r) => r.id));

  const resultsVideos = await db.query(`
  INSERT INTO videos(name, description, link)
   VALUES( 'v1', 'v1 describe', 'v1link.com'),
         ( 'v2', 'v2 describe', 'v2link.com'),
         ( 'v3', 'v3 describe', 'v3link.com')
   RETURNING id`);

  testVideoIds.splice(0, 0, ...resultsVideos.rows.map((r) => r.id));

  await db.query(
    `INSERT INTO videos_tags(video_id, tag_id)
       VALUES ($1, $2),
              ($3, $4)`,
    [testVideoIds[0], testTagIds[0], testVideoIds[1], testTagIds[1]]
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
  testTagIds,
  testVideoIds,
  testCustomerIds,
  testTeamIds,
};
