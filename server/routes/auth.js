import express from "express";
import {login , department, register , logout} from '../controllers/auth.js';

const routes = express.Router();

routes.post('/login',login);
routes.post('/logout',logout);
routes.post('/register',register);
routes.get('/department',department);

export default routes;