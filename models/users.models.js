const db = require("../database/connection");

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows: users }) => {
    return users;
  });
};

exports.selectUserByUserId = (user_id) => {
  // this checks the user_id is a positive integer
  const num = Number(user_id);
  if (!(Number.isInteger(num) && num > 0)) {
    return Promise.reject({
      status: 400,
      msg: "user_id must be a positive integer",
    });
  }

  return db
    .query(`SELECT * FROM users WHERE user_id=$1`, [user_id])
    .then(({ rows: [user] }) => {
      if (user) {
        return user;
      } else {
        return Promise.reject({ status: 404, msg: "User Not Found" });
      }
    });
};

exports.insertUser = (body) => {
  if (!body) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (!(body.username && body.name && body.email)) {
    return Promise.reject({ status: 400, msg: "Missing Required Fields" });
  }

  return db
    .query(
      `INSERT INTO users
    (username, name, email)
    VALUES
    ($1, $2, $3)
    RETURNING *`,
      [body.username, body.name, body.email]
    )
    .then(({ rows: [user] }) => {
      return user;
    });
};

exports.updateUser = (user_id, body) => {
  // this checks the user_id is a positive integer
  const num = Number(user_id);
  if (!(Number.isInteger(num) && num > 0)) {
    return Promise.reject({
      status: 400,
      msg: "user_id must be a positive integer",
    });
  }

  if (!body || Object.keys(body).length === 0) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const validKeys = ["username", "name", "email"];

  const keys = Object.keys(body);

  let queryString = `UPDATE users SET `;

  for (const key of keys) {
    if (validKeys.includes(key)) {
      queryString += `${key}='${body[key]}', `;
    }
  }

  queryString = queryString.slice(0, -2);
  queryString += ` WHERE user_id=${user_id} RETURNING *`;

  return db.query(queryString).then(({ rows: [user] }) => {
    if (user) {
      return user;
    } else {
      return Promise.reject({ status: 404, msg: "User Not Found" });
    }
  });
};
