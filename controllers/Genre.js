import asyncHandler from "../middlewares/asyncHandler.js";
import Genre from "../models/genre.js";

// Controller function to create a new genre
export const createGenre = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body;

        // Validate that the name is provided
        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }

        // Check if the genre already exists
        const existingGenre = await Genre.findOne({ name });
        if (existingGenre) {
            return res.status(400).json({ error: "Genre already exists" });
        }

        // Create and save the new genre
        const genre = new Genre({ name });
        await genre.save();

        // Respond with the newly created genre
        return res.status(201).json({
            message: "Genre created successfully",
            genre,
        });
    } catch (error) {
        console.error(error);  // Log the error for debugging
        return res.status(500).json({ error: "An error occurred while creating the genre" });
    }
});


export const updateGenre=asyncHandler(async(req,res)=>{
    try {
        const {name}=req.body;
        const {id}=req.params;

        const genre=await Genre.findOne({_id:id});

        if(!genre){
            return res.status(404).json({error:"Genre not found"});
        }
        genre.name=name;
        const updatedGenre=await genre.save();
        res.json(updatedGenre);
    } catch (error) {
        console.error(error);  // Log the error for debugging
        return res.status(500).json({ error: "An error occurred while updating the genre" }); 
    }
})

export const removeGenre=asyncHandler(async(req,res)=>{
    try {
        const {id}=req.params;
        const removed=await Genre.findByIdAndDelete(id);
        
        if(!removed){
            return res.status(404).json({error:"Genre not found"})
        }
        res.status(201).json({message:"Remove Genera Successfully",removed});
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: "An error occurred while removing the genre" }); 
    }
})

export const listGenre=asyncHandler(async(req,res)=>{
    try {
        const all=await Genre.find({});
        res.json({all});
    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message);
    }
})

export const readGenre=asyncHandler(async(req,res)=>{
    try {
        const genre=await Genre.findOne({_id:req.params.id});
        res.json(genre);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message)
    }
})