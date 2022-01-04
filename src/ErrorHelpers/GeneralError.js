/* eslint-disable import/extensions */
import BaseError from './BaseError.js';

/**
 * @class
 */
class GeneralError extends BaseError {
  /**
   *
   * @param {string} name
   * @param {number} httpCode
   * @param {boolean} isOperational
   * @param {string} description
   */
  constructor(name,
    httpCode,
    isOperational,
    description = 'An error occured')
  {
    super(name, httpCode, isOperational, description);
  }
}

export default GeneralError;
