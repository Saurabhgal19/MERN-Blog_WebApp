import express from  'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from "./routes/user.route.js"

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

app.listen(3000, () => {
    console.log("Server is running on port 3000....");
});

app.use('/api/user', userRoutes);