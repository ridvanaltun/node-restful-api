/**
 * Too Many Request Error
 */
class TooManyRequestError extends Error {
  /**
   * Constructor
   *
   * @param   {string}  message  Error message
   */
  constructor(message) {
    super();
    this.name = 'TooManyRequestError';
    this.code = 429;
    this.message = message;
  }
}

module.exports = TooManyRequestError;
