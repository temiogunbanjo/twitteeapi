/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
import User from '../domain/UserModel.js';
import Post from '../domain/PostModel.js';
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
   * @param {*} post
   */
  async createPost(post) {
    if (post instanceof Post) {
      return this.datarepo.createPost(post);
    }
  }

  /**
   * @param {*} userId userId of user to update
   * @param {*} postId uuid of the transaction to update
   * @param {*} updates fields with values to update
   */
  async updatePost(userId, postId, updates) {
    return this.datarepo.updatePost(userId, postId, updates);
  }

  /**
   * @param {*} postId uuid of the transaction to fetch
   */
  async fetchSinglePost(postId) {
    return this.datarepo.fetchSinglePost(postId);
  }

  /**
   * @param {*} filters filters to apply
   */
  async fetchAllPosts(filters) {
    return this.datarepo.fetchAllPosts(filters);
  }
}

export default DataSource;
