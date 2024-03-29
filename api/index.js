import express from  'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

    //Mongo Db connection
mongoose
    .connect(process.env.MONGO_DB)
    .then(() => {
        console.log('MongoDb is Connected');
    }).catch((error) => {
        console.log('Error in connecting to MongoDB', error);
    })

const app = express();

app.use(express.json());

app.listen(3000, () => {
    console.log("Server is running on port 3000....");
});


app.use('/api/user', userRoutes);
app.use('/api/auth',authRoutes);


//middleware
app.use((err,req,res,next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});