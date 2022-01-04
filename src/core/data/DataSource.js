/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
import User from '../domain/UserModel.js';
import Twit from '../domain/TwitModel.js';
import DataRepo from './DataRepo.js';

/**
@class DataSource
* */
class DataSource {
  /**
   *
   * @param {DataRepo} dataRepo;
   */
  constructor(dataRepo) {
    this.datarepo = dataRepo;
  }

  /**
   * @param {User} user Input parameter
   * @return createUser{@link User}
   */
  async createUser(user) {
    if (user instanceof User) {
      return this.datarepo.createUser(user);
    }
  }

  /**
   * @param {*} searchParameter Get login details of a user
   */
  async fetchUserCredentials(searchParameter) {
    return this.datarepo.fetchUserCredentials(searchParameter);
  }

  /**
   * @param {*} searchParameter Get details of a user
   */
  async fetchOneUser(searchParameter) {
    return this.datarepo.fetchOneUser(searchParameter);
  }

  /**
   * @param {*} filters Get details of a user
   */
  async fetchAllUsers(filters) {
    return this.datarepo.fetchAllUsers(filters);
  }

  /**
   * @param {*} userId userId of user to update
   * @param {Object} updateValues fields to update with corresponding update values
   */
  async updateUser(userId, updateValues) {
    return this.datarepo.updateUser(userId, updateValues);
  }

  /**
   * @param {*} twit
   */
  async createTwit(twit) {
    if (twit instanceof Twit) {
      return this.datarepo.createTwit(twit);
    }
  }

  /**
   * @param {*} userId userId of user to update
   * @param {*} postId uuid of the transaction to update
   * @param {*} updates fields with values to update
   */
  async updateTwit(userId, postId, updates) {
    return this.datarepo.updateTwit(userId, postId, updates);
  }

  /**
   * @param {*} postId uuid of the transaction to fetch
   */
  async fetchSingleTwit(postId) {
    return this.datarepo.fetchSingleTwit(postId);
  }

  /**
   * @param {*} filters filters to apply
   */
  async fetchAllTwits(filters) {
    return this.datarepo.fetchAllTwits(filters);
  }

  /**
   * @param {*} postId Twit to delete
   */
  async deleteTwit(postId) {
    return this.datarepo.deleteTwit(postId);
  }

  /**
   * @param {*} postId uuid of the post with comment
   * @param {*} filters filters to apply
   */
  async fetchAllComment(postId, filters) {
    return this.datarepo.fetchAllComment(postId, filters);
  }
}

export default DataSource;
