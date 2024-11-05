import express from 'express';
import { createUser, loginUser,logCurrentUser, getAllUser, getCurrentUserProfile, updateCurrentUserProfile, deleteUser } from '../controllers/user.js';
import { authenticate,  authorizeAdmin } from '../middlewares/authMiddleware.js';



const router=express.Router();

// router.post('/',authenticate,authorizeAdmin,createUser);
router.post('/',createUser);
router.get('/',authenticate,authorizeAdmin,getAllUser);
router.post('/auth',loginUser);
router.post('/logout',logCurrentUser);

router.get('/profile', authenticate, getCurrentUserProfile);
router.put('/profile', authenticate, updateCurrentUserProfile);
router.delete('/:id', authenticate,authorizeAdmin, deleteUser);


export default router;