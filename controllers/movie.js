import asyncHandler from "../middlewares/asyncHandler.js";
import { Movie } from "../models/Movie.js";


export const createMovie=asyncHandler(async(req,res)=>{
    try {
        const newMovie=new Movie(req.body);
        const sevedMovie=await newMovie.save();
        res.json(sevedMovie);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

export const getAllMovies=asyncHandler(async(req,res)=>{
    try {
        const movies=await Movie.find();
        res.json(movies);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

export const getSpecificMovie=asyncHandler(async(req,res)=>{
    try {
        const {id}=req.params;
        const specificMovie=await Movie.findById(id);
        if(!specificMovie){
            return res.status(404).json({message:"Movie not found"});
        }
        res.json(specificMovie);
    } catch (error) {
        res.status(500).json({error:error.message})
        
    }
})


export const updateMovie = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        
        if (!updatedMovie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        
        res.json(updatedMovie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export const movieReview = asyncHandler(async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const movie = await Movie.findById(req.params.id);

        if (movie) {
            // Check if user has already reviewed the movie
            const alreadyReviewed = movie.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );
            if (alreadyReviewed) {
                res.status(400);
                throw new Error("Movie already reviewed");
            }

            // Create review object
            const review = {
                name: req.user.username,
                rating: Number(rating),
                comment,
                user: req.user._id,
            };

            // Add review to movie's reviews array
            movie.reviews.push(review);

            // Update numReviews and average rating
            movie.numReviews = movie.reviews.length;
            movie.rating =
                movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
                movie.reviews.length;

            // Save updated movie
            await movie.save();
            res.status(201).json({ message: "Review added" });
        } else {
            res.status(404);
            throw new Error("Movie not found");
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});


export const deleteMovie=asyncHandler(async(req,res)=>{
    try {
        const {id}=req.params;
        const deleteMovie=await Movie.findByIdAndDelete(id);

        if(!deleteMovie){
            return res.status(404).json({messae:"Movie not found"});
        }
        res.json({message:"Movie deleted succesfully"});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

export const deleteComment = asyncHandler(async (req, res) => {
    try {
        const { movieId, reviewId } = req.body;
        const movie = await Movie.findById(movieId);

        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        // Find index of the review to delete
        const reviewIndex = movie.reviews.findIndex(
            (r) => r._id.toString() === reviewId
        );

        if (reviewIndex === -1) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Remove the review from reviews array
        movie.reviews.splice(reviewIndex, 1);

        // Update numReviews and recalculate average rating
        movie.numReviews = movie.reviews.length;
        movie.rating =
            movie.reviews.length > 0
                ? movie.reviews.reduce((acc, item) => item.rating + acc, 0) / movie.reviews.length
                : 0;

        // Save the updated movie document
        await movie.save();
        res.json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

export const getNewMovie = asyncHandler(async (req, res) => {
    try {
        const newMovies = await Movie.find().sort({ createdAt: -1 }).limit(10);
        res.json(newMovies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export const getTopMovie=asyncHandler(async(req,res)=>{
    try {
        const totalRatedMovies=await Movie.find().sort({numReviews:-1}).limit(10);
        // res.json({totalRatedMovies})
        res.json(totalRatedMovies);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

export const getRandamMovies=asyncHandler(async(req,res)=>{
    try {
       const randamMovies=await Movie.aggregate([{$sample:{size:10}}]);
       res.json(randamMovies)
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})