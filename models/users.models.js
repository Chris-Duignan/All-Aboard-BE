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