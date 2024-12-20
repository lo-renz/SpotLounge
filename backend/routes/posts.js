import express from 'express';
import { commentPost, createPost, deletePost, getPost, getPosts, likePost, unlikePost, myPost } from '../controllers/posts.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getPosts);
router.get('/:id', auth, getPost);
router.get('/myposts/:username', auth, myPost);

router.post('/', auth, createPost);
router.delete('/:id', auth, deletePost);
router.put('/like', auth, likePost);
router.put('/unlike', auth, unlikePost);
router.put('/comment', auth, commentPost);

export default router;
