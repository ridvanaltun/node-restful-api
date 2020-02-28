/**
 * Not Found Error
 */
class NotFoundError extends Error {
  /**
   * Constructor
   *
   * @param   {string}  message  Error message
   */
  constructor(message) {
    super();
    this.name = 'NotFoundError';
    this.code = 404;
    this.message = message;
  }
}

module.exports = NotFoundError;
