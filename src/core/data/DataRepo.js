/* eslint-disable class-methods-use-this */
// import db into this repo

import { Op } from 'sequelize';
import { User, Post } from '../../../models';

/**
 * @class
 */
class DataRepo {
  /**
   *
   * @param {UserModel} AUser
   * @returns UserModel
   */
  async createUser(AUser) {
    return User.create(AUser);
  }

  /**
   *
   * @param {WalletModel} wallet
   * @returns WalletModel
   */
  async createUserWallet(wallet) {
    return User.create(wallet);
  }

  /**
   * @param {string} searchParameter
   * @returns Promise
   */
  async fetchUserCredentials(searchParameter) {
    return User.findOne({
      where: {
        [Op.or]: [{ email: searchParameter }],
      },
    });
  }

  /**
   * @param {string} searchParameter
   * @returns Promise
   */
  async fetchOneUser(searchParameter) {
    return User.findOne({
      where: {
        [Op.or]: [{ email: searchParameter }, { uuid: searchParameter }],
      },
      attributes: {
        exclude: ['password'],
      },
    });
  }

  /**
   * @param {*} filters
   */
  async fetchAllUsers(filters) {
    if (typeof filters.status === 'string') {
      filters.status = filters.status.split(',');
    }

    if (typeof filters.role === 'string') {
      filters.role = filters.role.split(',');
    }
    // Check for optional parameter 'categories', add filter only if exist
    const searchCondition = !filters.search
      ? undefined
      : {
        [Op.or]: [
          { phone: { [Op.like]: `%${filters.search}%` } },
          { firstname: { [Op.like]: `%${filters.search}%` } },
          { lastname: { [Op.like]: `%${filters.search}%` } },
          { uuid: { [Op.like]: `%${filters.search}%` } },
        ],
      };

    // Check for optional parameter 'status', add filter only if defined
    const statusCondition = !filters.status
      ? undefined
      : {
        [Op.or]: filters.status.map((value) => ({ status: value }))
      };

    const roleCondition = !filters.role
      ? undefined
      : {
        [Op.or]: filters.role.map((value) => ({ role: value }))
      };

    // console.log(roleCondition);

    const dateRange = !filters.startDate
      ? undefined
      : {
        createdAt: {
          [Op.between]: [filters.startDate, filters.endDate]
        }
      };

    const SEQUELIZE_QUERY_CONDITIONS = {
      [Op.and]: [
        statusCondition,
        roleCondition,
        searchCondition,
        dateRange
      ]
    };

    const offset = filters.page < 1 ? 1 : filters.page - 1;
    const { limit } = filters;

    return User.findAll({
      where: SEQUELIZE_QUERY_CONDITIONS,
      attributes: { exclude: ['password', 'emailVerificationToken'] },
      // filters.orders comes in this format => ['field:ASC', 'field:DESC']
      order: filters.order.map((fieldAndOrderPair) => fieldAndOrderPair.split(':')),
      limit: limit && typeof limit === 'number' && !Number.isNaN(limit) ? limit : undefined,
      offset: offset * (limit || 1),
    });
  }

  /**
   * @param {*} userId
   * @param {string} updateValues
   * @returns Promise
   */
  async updateUser(userId, updateValues) {
    return User.update(updateValues, {
      where: { uuid: userId },
      returning: true,
    });
  }

  /**
   * @param {*} post
   */
  async createPost(post) {
    // console.log(transaction);
    return Post.create(post);
  }

  /**
   * @param {*} userId
   * @param {*} postId
   * @param {*} updates
   */
  async updatePost(userId, postId, updates) {
    return Post.update(updates, {
      where: { uuiduserId, postId },
      returning: true,
    });
  }

  /**
   * @param {*} postId
   * @returns Promise
   */
  async fetchSinglePost(postId) {
    return Post.findOne({
      where: { postId },
      attributes: {
        exclude: ['relationType', 'id', 'updatedAt'],
      },
    });
  }

  /**
   * @param {*} filters
   * @returns SequelizeModel
   */
  createQueryWithPostFilters(filters) {
    if (typeof filters.status === 'string') {
      filters.status = filters.status.split(',');
    }

    if (typeof filters.transactionType === 'string') {
      filters.transactionType = filters.transactionType.split(',');
    }
    // Check for optional parameter 'categories', add filter only if exist
    const searchCondition = !filters.search
      ? undefined
      : {
        [Op.or]: [
          { postId: { [Op.like]: `%${filters.search}%` } },
          { userId: { [Op.like]: `%${filters.search}%` } },
        ],
      };

    // Check for optional parameter 'status', add filter only if defined
    const statusCondition = !filters.status
      ? undefined
      : {
        [Op.or]: filters.status.map((value) => ({ status: value }))
      };

    const typeCondition = !filters.transactionType
      ? undefined
      : {
        [Op.or]: filters.transactionType.map((value) => ({ transactionType: value }))
      };

    const dateRange = !filters.startDate
      ? undefined
      : {
        createdAt: {
          [Op.between]: [filters.startDate, filters.endDate]
        }
      };

    if (!filters.minAmount) filters.minAmount = 1;
    if (!filters.maxAmount) filters.maxAmount = 999999999999999;

    const amountRange = {
      amount: {
        [Op.between]: [filters.minAmount, filters.maxAmount]
      }
    };

    const SEQUELIZE_QUERY_CONDITIONS = {
      [Op.and]: [
        statusCondition,
        searchCondition,
        typeCondition,
        amountRange,
        dateRange
      ],
    };

    return SEQUELIZE_QUERY_CONDITIONS;
  }

  /**
   * @param {*} filters
   * @returns Promise
   */
  async fetchAllPosts(filters) {
    const SEQUELIZE_QUERY_CONDITIONS = this.createQueryWithPostFilters(filters);

    const offset = filters.page < 1 ? 1 : filters.page - 1;
    const { limit } = filters;

    console.log(filters);

    return Post.findAll({
      where: SEQUELIZE_QUERY_CONDITIONS,
      attributes: {
        exclude: ['relationType', 'id', 'updatedAt'],
      },
      order: filters.order.map((fieldAndOrderPair) => fieldAndOrderPair.split(':')),
      limit: limit && typeof limit === 'number' && !Number.isNaN(limit) ? limit : undefined,
      offset: offset * (limit || 1),
    });
  }
}

export default DataRepo;
