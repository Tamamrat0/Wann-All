import express from "express";
import {LoadChat , Process , summary} from '../controllers/messages.js';
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post('/chat' , verifyToken , LoadChat)
router.post('/inprocess' , verifyToken , Process)
router.post('/summary' , verifyToken , summary)



export default router;