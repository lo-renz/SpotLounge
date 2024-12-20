import express from 'express';
import { signin, register, profile, messages, people, singleUser, editEmail, editUsername, editPassword, deleteAccount, personalProfile } from '../controllers/users.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/signin', signin);
router.get('/profile/:username', profile);
router.get('/profile', personalProfile);
router.get('/messages/:userId', messages);
router.get('/people', people);
router.get('/single-user/:userId', singleUser);

router.put("/settings/edit-email", auth, editEmail);
router.put("/settings/edit-username", auth, editUsername);
router.put("/settings/edit-password", auth, editPassword);
router.delete("/settings/delete-account", deleteAccount);

export default router;