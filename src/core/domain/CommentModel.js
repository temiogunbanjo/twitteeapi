// import HelperUtils from '../../utils/HelperUtils';

/**
 * @class
 *
 */
class Comment {
  /**
   * @param {*} name 
   * @param {*} userId 
   * @param {*} postId
   * @param {*} comment 
   */
  constructor(name, userId, postId, comment) {
    this.name = name;
    this.comment = comment;
    this.userId = userId;
    this.postId = postId;
    // this.numberOfLikes = 0;
  }
}

export default Comment;
