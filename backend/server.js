import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import connectDB from "./config/mongoDB.js";
import connectCloudinary from "./config/connectCloudinary.js";
import userRouter from "./routes/userRoute.js";
import pollRouter from './routes/pollRoute.js';

//App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();
//Middleware
app.use(cors());
app.use(express.json());
//API Endpoints
app.use('/api/user', express.urlencoded({ extended: true }), userRouter);
app.use('/api/poll', pollRouter);
//Health check route
app.get('/', (req, res) => {
    res.send("API is running always !");
});
//Start Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})


