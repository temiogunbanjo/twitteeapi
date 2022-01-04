import HelperUtils from '../../utils/HelperUtils';
/**
 * @class
 *
 */
class User {
  /**
   * @param {string} email
   * @param {string} password
   */
  constructor(email, password) {
    const [name] = email.split('@');

    this.name = name;
    this.email = email;
    this.password = password;
    this.emailVerificationToken = HelperUtils.generateRandomCharacters(32);
    this.hasVerifiedEmail = false;
  }
}

export default User;
