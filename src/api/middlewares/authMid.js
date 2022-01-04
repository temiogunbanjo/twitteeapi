/* eslint-disable valid-jsdoc */
/**
 *
 * Description. (This module handles token validation globaly in the app)
 */

import { verifyToken } from '../../utils/tokenProcessor';
import { sendErrorResponse } from '../../utils/sendResponses';
import DbValidator from '../../core/data/dbValidator';

/**
 * @param {Request} req
 * @param {Response} next
 * @param {import('express').NextFunction} res
 * @returns Response
 */

export default async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return sendErrorResponse(res,
        401, 'Authentication required');
    }
    const token = req.headers.authorization.split(' ')[1]
    || req.headers.authorization || req.headers.cookie.split('=')[1];
    if (!token) return res.status(401).send({ message: 'Access Denied' });
    const { uuid } = verifyToken(token);

    // this step is not neccesary as the token will be coming from the api gateway
    // so we may have to get the user value from the token directly
    const { available, user } = await DbValidator.userIsAvailable(uuid);

    if (available) {
      req.user = user;
    } else {
      return sendErrorResponse(res, 401, 'Access Denied');
    }
    req.token = token;
    next();
  } catch (err) {
    const error = err.message ? 'Authentication Failed'
      : err;
    next(error);
  }
};
