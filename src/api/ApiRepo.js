/* eslint-disable valid-jsdoc */
/* eslint-disable class-methods-use-this */

/**
@module ApiRepo
* */
import DataRepo from '../core/data/DataRepo';
import DataSource from '../core/data/DataSource';
import HttpStatusCode from '../ErrorHelpers/Statuscode';
import HelperUtils from '../utils/HelperUtils';
import User from '../core/domain/UserModel';
import Post from '../core/domain/PostModel';
import Comment from '../core/domain/CommentModel';
import { sendSuccessResponse, sendErrorResponse } from '../utils/sendResponses';
import { createToken, verifyToken } from '../utils/tokenProcessor';
import { sendEmail } from '../utils/sendNotifications';

const ph = require('../utils/hash').default;
/**
@class
* */
class ApiRepo {
  /**
   * @constructor
   */
  constructor() {
    this.dataRepo = new DataRepo();
    this.dataSource = new DataSource(this.dataRepo);
    this.datasource = this.dataSource;
  }

  /**
   *
   * @method
   * @param {Request} req
   * @param {Response} res
   * @param {import('express').NextFunction} next
   * @returns Response
   */
  async healthCheck(req, res, next) {
    try {
      res.status(HttpStatusCode.OK).send({
        status: 'running',
        description: 'Service is up and running',
        statuscode: HttpStatusCode.OK,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @method
   * @param {Request} req
   * @param {Response} res
   * @param {import('express').NextFunction} next
   * @returns Response
   */
  async getLogs(req, res, next) {
    try {
      const passkey = req.query.key;
      if (passkey && passkey === 'twitteeadmin123') {
        return res.status(HttpStatusCode.OK).download('./logs/app.log');
      }
      return res
        .status(HttpStatusCode.FORBIDDEN)
        .send('<h1>Access Denied</h1>');
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   * @method
   * @param {Request} req
   * @param {Response} res
   * @param {import('express').NextFunction} next
   * @returns Response
   */
  async createUser(req, res, next) {
    try {
      const repo = new ApiRepo();
      const { email, password } = req.body;

      const existingUser = await repo.datasource.fetchOneUser(email);
      if (existingUser) {
        return sendErrorResponse(
          res,
          HttpStatusCode.BAD_REQUEST,
          'user with email exist already'
        );
      }

      const user = new User(email, ph.encrypt(password));

      const accountCreationResponse = await repo.datasource.createUser(user);
      // console.log(accountCreationResponse, user);
      const emailVerificationLink = `${process.env.BASE_URL}/api/v1/user/verify-email?userId=${accountCreationResponse.userId}&verificationCode=${user.emailVerificationToken}`;

      await sendEmail({
        senderEmail: 'admin@twittee.com',
        receipientEmail: email,
        subject: 'Email Verification',
        content: `<a href='${emailVerificationLink}'>Click to verify email</a>`,
      });

      return sendSuccessResponse(res, HttpStatusCode.CREATED, {
        message: 'Created Successfully',
        emailVerificationLink,
        data: {
          name: user.name,
          email: user.email,
          hasVerifiedEmail: user.hasVerifiedEmail
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   * @method
   * @param {Request} req
   * @param {Response} res
   * @param {import('express').NextFunction} next
   * @returns Response
   */
  async loginUser(req, res, next) {
    try {
      const repo = new ApiRepo();
      const { email, password } = req.body;

      const user = await repo.datasource.fetchUserCredentials(email);
      // console.log(user);
      if (!user) {
        return sendErrorResponse(
          res,
          HttpStatusCode.NOT_FOUND,
          'user not found'
        );
      }

      if (ph.decrypt(user.password) !== password) {
        return sendErrorResponse(
          res,
          HttpStatusCode.UNAUTHORIZED,
          'incorrect login'
        );
      }

      const payload = {
        userId: user.userId,
        email: user.email,
        name: user.name,
        hasVerifiedEmail: user.hasVerifiedEmail,
        createdAt: user.createdAt,
      };

      return sendSuccessResponse(res, HttpStatusCode.OK, {
        message: 'Logged in successfully',
        data: {
          token: createToken(payload),
          expiresAt: new Date(Date.now() + 3600000).toLocaleTimeString(),
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   * @method
   * @param {Request} req
   * @param {Response} res
   * @param {import('express').NextFunction} next
   * @returns Response
   */
  async fetchUser(req, res, next) {
    try {
      const repo = new ApiRepo();
      const { userId } = req.params;

      const user = await repo.datasource.fetchOneUser(userId);
      // console.log(user);
      if (!user) {
        return sendErrorResponse(
          res,
          HttpStatusCode.NOT_FOUND,
          'user not found'
        );
      }

      const payload = {
        userId: user.userId,
        name: user.name,
        email: user.email,
        hasVerifiedEmail: user.hasVerifiedEmail,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      return sendSuccessResponse(res, 200, {
        message: 'user found successfully',
        data: payload,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   * @method
   * @param {Request} req
   * @param {Response} res
   * @param {import('express').NextFunction} next
   * @returns Response
   */
  async fetchAllUsers(req, res, next) {
    try {
      const repo = new ApiRepo();
      const filters = HelperUtils.mapAsFilter(req.query);

      const users = await repo.datasource.fetchAllUsers(filters);

      return sendSuccessResponse(res, HttpStatusCode.OK, {
        message: `Found ${users ? users.length : 0} results`,
        data: users,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   * @method
   * @param {Request} req
   * @param {Response} res
   * @param {import('express').NextFunction} next
   * @returns Response
   */
  async updateUser(req, res, next) {
    try {
      const repo = new ApiRepo();
      const { phone, firstname, lastname } = req.body;
      const { userId } = req.params;

      const user = await repo.datasource.fetchOneUser(userId);
      if (!user) {
        return sendErrorResponse(
          res,
          HttpStatusCode.NOT_FOUND,
          'user not found'
        );
      }

      const payload = { phone, firstname, lastname };
      const profileUpdateResult = await repo.datasource.updateUser(
        userId,
        payload
      );
      if (!profileUpdateResult) {
        return sendErrorResponse(
          res,
          HttpStatusCode.INTERNAL_SERVER,
          'An error occured'
        );
      }

      return sendSuccessResponse(res, HttpStatusCode.OK, {
        message: 'profile updated successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   * @method
   * @param {Request} req
   * @param {Response} res
   * @param {import('express').NextFunction} next
   * @returns Response
   */
  async sendVerificationMail(req, res, next) {
    try {
      const repo = new ApiRepo();
      const { userId } = req.body;

      const existingUser = await repo.datasource.fetchOneUser(userId);
      // console.log(user);
      if (!existingUser) {
        return sendErrorResponse(
          res,
          HttpStatusCode.NOT_FOUND,
          'user not found'
        );
      }

      if (existingUser.hasVerifiedEmail) {
        return sendErrorResponse(
          res,
          HttpStatusCode.BAD_REQUEST,
          'Email has already been verified'
        );
      }

      const verificationCode = HelperUtils.generateRandomCharacters(32);
      const updateTokenResponse = await repo.datasource.updateUser(userId, {
        emailVerificationToken: verificationCode,
      });

      if (!updateTokenResponse) {
        return sendErrorResponse(
          res,
          HttpStatusCode.INTERNAL_SERVER,
          'An error occured! Please try again.'
        );
      }
      const emailVerificationLink = `${process.env.BASE_URL}/api/v1/user/verify-email?userId=${userId}&verificationCode=${verificationCode}`;

      await sendEmail({
        senderEmail: 'admin@twittee.com',
        receipientEmail: existingUser.email,
        subject: 'Email Verification',
        content: `<a href='${emailVerificationLink}'>Click to verify email</a>`,
      });

      return sendSuccessResponse(res, HttpStatusCode.CREATED, {
        message: 'Email verification link has been sent to your primary email',
        emailVerificationLink,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   * @method
   * @param {Request} req
   * @param {Response} res
   * @param {import('express').NextFunction} next
   * @returns Response
   */
  async validateToken(req, res, next) {
    try {
      let payload = null;
      const { token } = req.query;
      // console.log(Date.now());
      try {
        if (!token) {
          return sendErrorResponse(
            res,
            HttpStatusCode.BAD_REQUEST,
            'invalid token'
          );
        }
        payload = verifyToken(token);
      } catch (error) {
        return sendErrorResponse(
          res,
          HttpStatusCode.BAD_REQUEST,
          error.message
        );
      }

      return sendSuccessResponse(res, HttpStatusCode.OK, {
        message: 'token verified successfully',
        data: payload,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   * @method
   * @param {Request} req
   * @param {Response} res
   * @param {import('express').NextFunction} next
   * @returns Response
   */
  async verifyEmail(req, res, next) {
    try {
      const repo = new ApiRepo();
      const { userId, verificationCode } = req.query;

      const user = await repo.datasource.fetchOneUser(userId);
      if (!userId || !user || !verificationCode) {
        return sendErrorResponse(
          res,
          HttpStatusCode.BAD_REQUEST,
          'invalid verification link'
        );
      }

      if (user.hasVerifiedEmail) {
        return sendErrorResponse(
          res,
          HttpStatusCode.BAD_REQUEST,
          'Email has been verified already'
        );
      }

      if (!(
        user.emailVerificationToken === verificationCode
        && user.userId === userId
      )) {
        return sendErrorResponse(
          res,
          HttpStatusCode.BAD_REQUEST,
          'invalid verification link'
        );
      }

      const updateUserVerificationStatus = await repo.datasource.updateUser(
        userId,
        { hasVerifiedEmail: true, emailVerificationToken: null }
      );
      if (!updateUserVerificationStatus) {
        return sendErrorResponse(
          res,
          HttpStatusCode.INTERNAL_SERVER,
          'Could not verify email'
        );
      }

      return sendSuccessResponse(res, HttpStatusCode.OK, {
        message: 'email verified successfully',
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   * @method
   * @param {Request} req
   * @param {Response} res
   * @param {import('express').NextFunction} next
   * @returns Response
   */
  async createNewPost(req, res, next) {
    try {
      const repo = new ApiRepo();
      const {
        userId,
        type,
        amount,
        narration,
        referenceId,
      } = req.body;

      const transaction = new Post(
        userId,
        type,
        amount,
        narration,
        'pending',
        referenceId,
        true
      );

      const transactionCreationResponse = await repo.datasource.createTransaction(transaction);
      if (!transactionCreationResponse) return sendErrorResponse(res, HttpStatusCode.INTERNAL_SERVER, 'An error occured');

      return sendSuccessResponse(res, HttpStatusCode.OK, {
        data: {
          transactionId: transactionCreationResponse.transactionId,
          userId: transaction.userId,
          amount: transaction.amount,
          transactionType: transaction.transactionType,
          narration: transaction.narration,
          status: transaction.status,
          referenceId: transaction.referenceId,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   * @method
   * @param {Request} req
   * @param {Response} res
   * @param {import('express').NextFunction} next
   * @returns Response
   */
  async fetchSinglePost(req, res, next) {
    try {
      const repo = new ApiRepo();
      const { postId } = req.params;

      const transactionDetails = await repo.datasource.fetchSingleTransaction(
        postId
      );

      return sendSuccessResponse(res, HttpStatusCode.OK, {
        data: transactionDetails,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   * @method
   * @param {Request} req
   * @param {Response} res
   * @param {import('express').NextFunction} next
   * @returns Response
   */
  async fetchAllPosts(req, res, next) {
    try {
      const repo = new ApiRepo();
      const filters = HelperUtils.mapAsFilter(req.query);

      const transactions = await repo.datasource.fetchAllUserTransactions(filters);

      return sendSuccessResponse(res, HttpStatusCode.OK, {
        data: transactions,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @method
   * @param {Request} req
   * @param {Response} res
   * @param {import('express').NextFunction} next
   * @returns Response
   */
  async updateATransaction(req, res, next) {
    try {
      const repo = new ApiRepo();
      const { userId } = req.body;
      const { transactionId } = req.params;

      const transactionUpdateResponse = await repo.datasource.updateTransaction(
        userId, transactionId, {}
      );

      // console.log(transactionUpdateResponse);
      return sendSuccessResponse(res, HttpStatusCode.OK, {
        data: null,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default ApiRepo;