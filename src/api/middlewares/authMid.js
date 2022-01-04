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

    const payload = verifyToken(token);
    console.log(payload);

    if (payload) {
      req.user = payload;
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
