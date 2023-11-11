import express from "express";
import {getUser, getUserFriends,addRemoveFriend,auth,getUserAll,
addUser,activateEmployees , editEmployees , history_edit , activateLogin,resetpassword,addaccount,getAccountAll} from '../controllers/users.js';
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();


router.get('/auth',verifyToken,auth);
router.get('/usersall',verifyToken,getUserAll);
router.get('/usersacc',verifyToken,getAccountAll);
router.post('/adduser' ,verifyToken,addUser)
router.post('/activate' ,verifyToken,activateEmployees)
router.post('/activate_login' ,verifyToken,activateLogin)
router.post('/editemploy' ,verifyToken,editEmployees)
router.post('/history' , verifyToken, history_edit)
router.post('/resetpassword' , verifyToken, resetpassword)
router.post('/addaccount' , verifyToken, addaccount)


router.get('/:id',verifyToken,getUser);
router.get('/:id/friends',verifyToken,getUserFriends);

router.patch('/:id/:friendId',verifyToken,addRemoveFriend);

export default router;