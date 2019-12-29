import { Router } from "express";
import verifyToken from "../../helpers/verifyToken";
import Controller from "./listing.controller";

const user: Router = Router();
const controller = new Controller();

// Retrieve all Users
user.get("/", controller.findAll);

// Retrieve a Specific User
user.get("/:id", controller.findOne);

// Update a User with Id
user.put("/:id", controller.update);

// Delete a User with Id
user.delete("/:id", controller.remove);

export default user;
