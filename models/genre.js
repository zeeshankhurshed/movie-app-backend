import mongoose from "mongoose";

// Define the schema for the Genre model
const GenreSchema = new mongoose.Schema({
    name: {
        type: String,        // The type of the field is a String
        required: true,      // The field is required
        maxLength: 32,      // The maximum length of the string
        unique: true,        // The field must be unique across all Genre documents
    }
}, {
    timestamps: true,       // Automatically manage createdAt and updatedAt fields
});

// Export the Genre model based on the defined schema
export default mongoose.model('Genre', GenreSchema);
