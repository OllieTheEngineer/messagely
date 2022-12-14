/** User class for message.ly */
const db = require("../db");
const ExpressError = require("../expressError");
const bcrypt = require("bcrypt");

const { BCRYPT_WORK_FACTOR} = require("../config");



/** User of the site. */

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({username, password, first_name, last_name, phone}) {
    let validPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const res = await db.query(
      `INSERT INTO users (
        username,
        password,
        first_name,
        last_name,
        phone)
        VALUES($1, $2, $3, $4, $5)
        RETURNING username, password, first_name, last_name, phone`,
        [username, validPassword, first_name, last_name, phone]
    )
    return res.rows[0]
   }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    const res = await db.query(
      "SELECT password FROM users WHERE username = $1", [username]);
     let user = res.rows[0];

     return user && await bcrypt.compare(password, user.password);
   }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    const res = db.query (
      `UPDATE users
        SET last_login_at = current_timestamp
        WHERE username = $1
        RETURNING username`, [username]);

      return res.rows[0];
   }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() {
    const res = await db.query(
      `SELECT username,
              first_name,
              last_name,
              phone
       FROM users
       ORDER BY username`);

    return res.rows;
   }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    const res
   }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) { }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) { }
}


module.exports = User;