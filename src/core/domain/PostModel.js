/**
 * @class
 *
 */
class Post {
  /**
   * @constructor
   * @param {*} userId
   * @param {*} type
   * @param {*} amount
   * @param {*} narration
   * @param {*} status
   * @param {*} referenceId
   * @param {*} isWalletHistory
   */
  constructor(userId, type, amount, narration, status, referenceId, isWalletHistory = true) {
    this.userId = userId;
    this.amount = amount;
    this.transactionType = type;
    this.narration = (narration === '' || narration === null || !narration)
      ? `${type} of ${amount} on your wallet`
      : narration;
    this.status = (!status) ? 'pending' : status;
    this.relationType = (isWalletHistory) ? 'wallet' : 'general';
    this.referenceId = referenceId;
  }
}

export default Post;
