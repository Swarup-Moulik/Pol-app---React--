import express from 'express';
import upload from "../middleware/multer.js"
import userAuth from "../middleware/userAuth.js"
import { createPoll, listPoll, deletePoll, votePoll } from "../controllers/pollController.js"

const pollRouter = express.Router();

pollRouter.post('/add', userAuth, upload.fields([{name: 'pollImages', maxCount: 20}]), createPoll);
pollRouter.get('/list', listPoll);
pollRouter.delete('/delete/:pollId', userAuth, deletePoll);
pollRouter.post('/vote', votePoll);

export default pollRouter;
