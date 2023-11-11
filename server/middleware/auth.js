import jwt from 'jsonwebtoken';
import env from 'dotenv';
env.config();

export const verifyToken = async (req,res, next)=>{
 
        const {token} = req.cookies
       

        if (!token){
            return res.status(403).send('Access Deied')
        }
        try{
            const verified = jwt.verify(token, process.env.SECRET)
            // console.log(verified)
           

            req.body = { ...req.body , ...verified };
             next();

        }catch (err){
            //  return res.status(403).send('Access Deied')
             return res.clearCookie('token').status(403).send('Access Deied')
        }

};