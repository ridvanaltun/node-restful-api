/**
 * Bad Request Error
 */
class BadRequestError extends Error {
  /**
   * Constructor
   *
   * @param   {string}  message  Error message
   */
  constructor(message) {
    super();
    this.name = 'BadRequestError';
    this.code = 400;
    this.message = message;
  }
}

module.exports = BadRequestError;
