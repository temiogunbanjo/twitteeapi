import express from 'express';
import ApiRepo from '../ApiRepo';
import Validator from '../middlewares/validatorMiddleWare';

const router = express.Router();

const repo = new ApiRepo();

router.get('/health-check', repo.healthCheck);
router.get('/get-logs', repo.getLogs);

// AUTH ENDPOINTS
router.post(
  '/auth/signup',
  Validator.validateSignUp,
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
  '/posts/create-post',
  Validator.selectValidation(''),
  Validator.validateRequest,
  repo.createNewPost
);

router.post(
  '/posts/:postId',
  repo.fetchSinglePost
);

router.get(
  '/posts/list-posts',
  repo.fetchAllPosts
);

export default router;
