import {connection} from '../models/Connection.js';
import sql from 'mssql';
export const  createPost = async (req , res) => {
     try{
        const {userId , description , picturePath} = req.body;
        const sqlRequest = new sql.Request(connection);
        const sqluser = await sqlRequest.query(`SELECT * FROM users WHERE id = ${userId}`);
        if (sqluser.recordset.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const user = sqluser.recordset[0];
        console.log(user)
        await sqlRequest.query(`INSERT INTO post (userId, firstName , lastName , location , description , userPicturePath , picturePath ,likes , comments )
        VALUES (${userId},'${user.firstName}','${user.lastName}','${user.location}','${description}','${user.picturePath}','${picturePath}','{}','[]')`);

        const post = await sqlRequest.query(`SELECT * FROM post WHERE userId = ${userId} `);

        res.status(200).json(post);
     }catch(err){
         res.json(404).json({message: err.message})
     }
}

export const getFeedPosts = async(req,res) =>{
    try{
        
        const sqlRequest = new sql.Request(connection);
        const posts = await sqlRequest.query(`SELECT * FROM post`);
        res.status(201).json(posts);
    }catch(err){
        
        res.json(404).json({message: err.message})
    }

}
export const getUserPosts = async(req,res) =>{
    // try{
        const {userId} = req.params;
        console.log(userId)
        const sqlRequest = new sql.Request(connection);
        const post = await sqlRequest.query(`SELECT * FROM post WHERE userId = ${userId}`);
        res.status(200).json(post.recordset[0]);
    // }catch(err){
        
    //     res.json(404).json({message: err.message})
    // }

}

export const likePost = async (req,res) =>{
    // try{
        const {id} = req.params;
        const {userId} = req.body;
        const sqlRequest = new sql.Request(connection);
        const post = await sqlRequest.query(`SELECT * FROM Post WHERE Id = ${id}`);
        console.log(userId)
        let isLiked = JSON.parse(post.recordset[0].likes)
        console.log(isLiked)
        
        // isLiked = "{userId:1,userId:2,}"
        
        // isLiked = {userId:1,userId:2,}
        if (isLiked) {
            isLiked.delete(userId);
        }else{
            isLiked.set(userId, true);
        }
        const updatePost = await sqlRequest.query(`UPDATE post 
        SET likes = ${isLiked}`)
        const posts = await sqlRequest.query(`SELECT * FROM post WHERE id = ${id}`);
        res.status(200).json(posts);
    // }catch(err){
    //     res.json(404).json({message: err.message})
    // }
}