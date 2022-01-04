/* eslint-disable valid-jsdoc */
/* eslint-disable class-methods-use-this */

import model from '../../../models';

const { User } = model;

/**
 *
 * @class;
 * @name DbValidator
 */
class DbValidator {
/**
     *
     * @param {number} phone
     * @returns Promise<Boolean>
     */
  static async numberIsTaken(phone) {
    const user = await User.findOne({ where: { phone } });
    return !!user;
  }

  /**
     *
     * @param {string} email
     * @returns Promise<Boolean>
     */
  static async emailIsTaken(email) {
    const user = await User.findOne({ where: { email } });
    return !!user;
  }

  /**
     *
     * @param {string} email
     * @param {string} phone
     * @returns Promise<Boolean>
     */
  static async notOwnNumber(phone, email) {
    const user = await User.findOne({ where: { email, phone } });
    return !user;
  }

  /**
     *
     * @param {string} uuid
     * @returns Object { available, user }
     */
  static async userIsAvailable(uuid) {
    const user = await User.findOne({ where: { uuid } });
    if (user) {
      return { available: true, user };
    }
    return { available: false };
  }
}

export default DbValidator;
