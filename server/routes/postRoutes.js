import express from 'express';
import protectedRoute from '../middleware/protectedRoute.js';
import {
  deletePost,
  getFeedPosts,
  getPost,
  likeUnLikePost,
  replyToPost,
  createPost,
  getUserPosts,
} from '../controllers/postController.js';

const router = express.Router();

router.get('/feed', protectedRoute, getFeedPosts);
router.get('/:id', getPost);
router.get('/user/:username', getUserPosts);
router.post('/create', protectedRoute, createPost);
router.delete('/:id', protectedRoute, deletePost);
router.put('/like/:id', protectedRoute, likeUnLikePost);
router.put('/reply/:postId', protectedRoute, replyToPost);

export default router;
