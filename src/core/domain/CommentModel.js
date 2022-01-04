// import HelperUtils from '../../utils/HelperUtils';

/**
 * @class
 *
 */
class Comment {
  /**
   * @param {*} name 
   * @param {*} userId 
   * @param {*} comment 
   */
  constructor(name, userId, comment) {
    this.name = name;
    this.comment = comment;
    this.userId = userId;
    // this.numberOfLikes = 0;
  }
}

export default Comment;
