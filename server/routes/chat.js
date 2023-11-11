import express from "express";
import { createChat , userChats} from "../controllers/chat.js";


const routes = express.Router();

routes.get('/', createChat);
routes.get('/:userId', userChats);
routes.get('/find/:firstId/:secondId', userChats);


export default routes;