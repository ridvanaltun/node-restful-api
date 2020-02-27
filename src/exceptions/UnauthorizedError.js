/**
 * Unauthorized Error
 */
class UnauthorizedError extends Error {
  /**
   * Constructor
   *
   * @param   {string}  message  Error message
   */
  constructor(message) {
    super();
    this.name = 'UnauthorizedError';
    this.code = 401;
    this.message = message;
  }
}

module.exports = UnauthorizedError;
