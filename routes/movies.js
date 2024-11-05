import express from 'express';

const router=express.Router();

import { authenticate,authorizeAdmin } from '../middlewares/authMiddleware.js';
import checkId from '../middlewares/checkId.js';
import { createMovie,getAllMovies,getSpecificMovie,updateMovie,movieReview,deleteMovie,deleteComment,getNewMovie,getTopMovie,getRandamMovies } from '../controllers/movie.js';

//public routes
router.get("/allMovies",getAllMovies);
router.get("/specificMovie/:id", getSpecificMovie);
router.get("/newMovies", getNewMovie);
router.get("/topMovies", getTopMovie);
router.get("/randamMovies", getRandamMovies);

//restricted routes
router.post("/:id/reviews", authenticate,checkId,movieReview);

//admin routes
router.post('/createMovie',authenticate,authorizeAdmin,createMovie);
router.put('/updateMovie/:id',authenticate,authorizeAdmin,updateMovie);
router.delete('/deleteMovie/:id',authenticate,authorizeAdmin,deleteMovie);
router.delete('/deleteComment/:id',authenticate,authorizeAdmin,deleteComment);


export default router;