import { Router } from 'express';
import Controller from './auth.controller';
import {authenticate} from "./auth.middleware";

const user: Router = Router();
const controller = new Controller();

// Sign In
user.post('/authenticate', controller.authenticate);
user.get('/authenticate', authenticate, controller.getCurrent);

// Register New User
user.post('/register', controller.register);
user.post('/refresh', controller.refresh);

export default user;
