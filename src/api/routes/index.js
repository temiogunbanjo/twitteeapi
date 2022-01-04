import express from 'express';
import ApiRepo from '../ApiRepo';
import Validator from '../middlewares/validatorMiddleWare';
import authmid from '../middlewares/authMid';

const router = express.Router();

const repo = new ApiRepo();

router.get('/health-check', repo.healthCheck);
router.get('/get-logs', repo.getLogs);

// AUTH ENDPOINTS
router.post(
  '/auth/signup',
  Validator.validateSignUp,
  Validator.validateRequest,
  repo.createUser
);

router.post(
  '/auth/login',
  Validator.selectValidation('email', 'password'),
  Validator.validateRequest,
  repo.loginUser
);

router.get('/auth/validate-token', repo.validateToken);

router.post(
  '/user/send-verification-email',
  Validator.selectValidation('userId'),
  Validator.validateRequest,
  repo.sendVerificationMail
);

router.get('/user/verify-email', repo.verifyEmail);

router.post('/user/:userId', repo.fetchUser);
router.get('/user/list-users', repo.fetchAllUsers);

router.put(
  '/user/:userId/update-profile',
  Validator.validateProfileUpdate,
  Validator.validateRequest,
  repo.updateUser
);

// POSTS ENDPOINTS
router.post(
  '/twits/create-twit',
  authmid,
  Validator.selectValidation(''),
  Validator.validateRequest,
  repo.createNewTwit
);

router.post(
  '/twits/:postId',
  repo.fetchSingleTwit
);

router.delete(
  '/twits/delete-twit',
  authmid,
  Validator.selectValidation('postId'),
  Validator.validateRequest,
  repo.deleteTwit
);

router.get(
  '/twits/list-twits',
  repo.fetchAllTwits
);

router.post(
  '/twits/:postId/like',
  authmid,
  Validator.selectValidation('userId'),
  Validator.validateRequest,
  repo.likeTwit
);

router.post(
  '/twits/:postId/add-comment',
  authmid,
  Validator.selectValidation('userId'),
  Validator.validateRequest,
  repo.createNewComment
);

router.get(
  '/twits/:postId/list-comments',
  authmid,
  Validator.selectValidation('userId'),
  Validator.validateRequest,
  repo.fetchTwitComments
);

export default router;
