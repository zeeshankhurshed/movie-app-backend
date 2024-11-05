import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/user.js';
import genreRoutes from './routes/genre.js';
import moviesRoutes from './routes/movies.js';
import uploadRoutes from './routes/upload.js';
import path from 'path';

// configuration
dotenv.config();

connectDB();

const app = express()

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const PORT = process.env.PORT ||4001;


//routes
app.use('/users',userRoutes);
app.use('/genre',genreRoutes);
app.use('/movies',moviesRoutes);

app.use("/upload",uploadRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname+ '/uploads')));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});





