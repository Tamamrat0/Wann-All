import express from "express";
import {pageall,getpermission_group ,addpermission_group,addpermission_confirm , deletepermission , updatepermiss} from '../controllers/permiss.js';
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();


router.get('/pageall' , verifyToken, pageall)
router.get('/permiss_g' , verifyToken, getpermission_group)
router.post('/permiss_addgroup' , verifyToken, addpermission_group)
router.post('/permiss_confirm' , verifyToken, addpermission_confirm)
router.post('/permiss_delete' , verifyToken, deletepermission)
router.post('/permiss_update' , verifyToken, updatepermiss)



export default router;