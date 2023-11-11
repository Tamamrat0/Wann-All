import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {newTicket , getTicket , getAllAssets , already_read} from '../controllers/ticket.js';

const router = express.Router();

router.get('/', verifyToken, getTicket)
router.post("/newTicket",verifyToken,newTicket);
router.post("/assets",verifyToken,getAllAssets);
router.post("/read",verifyToken,already_read);


export default router;