import express from 'express';

const router=express.Router();


import { authenticate,authorizeAdmin } from '../middlewares/authMiddleware.js';
import { createGenre, removeGenre, updateGenre,listGenre,readGenre } from '../controllers/genre.js';


router.post('/',authenticate,authorizeAdmin,createGenre);
router.put('/:id',authenticate,authorizeAdmin,updateGenre);
router.delete('/:id',authenticate,authorizeAdmin,removeGenre);
router.get('/genres',listGenre);
router.get('/:id',readGenre);



export default router;