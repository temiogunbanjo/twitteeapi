/**
 * @class
 *
 */
class Twit {
  /**
   * @param {*} image 
   * @param {*} caption 
   * @param {*} name 
   * @param {*} userId 
   */
  constructor(image, caption, name, userId) {
    this.image = image;
    this.caption = caption;
    this.posterName = name;
    this.userId = userId;
    this.numberOfLikes = 0;
  }
}

export default Twit;
