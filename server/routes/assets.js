import express from "express";
import {newcategory,allcate,allassets,deletecate,updatecate , alltypes , addtypes , delettypes , addassets} from '../controllers/assets.js';
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post('/newcategory' , verifyToken , newcategory)
router.get('/allcate' , verifyToken , allcate)
router.get('/allassets' , verifyToken , allassets)
router.post('/deletecategory' , verifyToken , deletecate)
router.post('/updatecate' , verifyToken , updatecate)
router.get('/alltypes' , verifyToken , alltypes)
router.post('/addtypes' , verifyToken , addtypes)
router.post('/deltypes' , verifyToken , delettypes)
router.post('/addassets' , verifyToken , addassets)



export default router;