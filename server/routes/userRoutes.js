import { Router } from 'express';
import {
  followUnFollow,
  getUserProfile,
  loginUser,
  logoutUser,
  signupUser,
  updateUser,
} from '../controllers/userController.js';
import protectedRoute from '../middleware/protectedRoute.js';

const router = Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile/:query', getUserProfile);
router.post('/follow/:id', protectedRoute, followUnFollow);
router.put('/update/:id', protectedRoute, updateUser);

export default router;
