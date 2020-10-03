import { Router } from 'express';
import verifyToken from '../../helpers/verifyToken';
import Controller from './user.controller';

const user: Router = Router();
const controller = new Controller();

// Retrieve all Users
user.get('/', controller.findAll);

// Retrieve a Specific User
user.get('/:id', verifyToken, controller.findOne);

export default user;
