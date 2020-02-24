const bcrypt = require('bcrypt');

/**
 * Hash given password
 *
 * @param   {string}  password  User password
 *
 * @return  {string}            Hashed password
 */
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
};

/**
 * Validate given password with hashed password
 *
 * @param   {string}  plainPassword   Plain password
 * @param   {string}  hashedPassword  Hashed password
 *
 * @return  {boolean}                 Is password same as in hashed version
 */
async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = {
  hashPassword,
  validatePassword,
};
