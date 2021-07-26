const bcrypt = require("bcrypt");
const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {
  await db.query("DELETE FROM team");
  await db.query("DELETE FROM customers");

  const resultsCustomers = await db.query(`
  INSERT INTO customers(name, email, phone, company)
  VALUES ('Test Cust', 'testemail@email.com', '111-111-1111', 'Test Company'),
         ('Test Cust2', 'testemail2@email.com', '222-222-2222', 'Test Company 2')
  `);

  const resultsTeam = await db.query(`
    INSERT INTO team(name, bio, img)
    VALUES ('Team Member', 'Team Member Bio', 'https://via.placeholder.com/150'),
           ('Team Member 2', 'Team Member Bio 2', 'https://via.placeholder.com/150')
    `);

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
};
