import { Router } from "express";
import verifyToken from "../../helpers/verifyToken";
import Controller from "./category.controller";

const variation: Router = Router();
const controller = new Controller();

// Retrieve all Users
variation.get("/", controller.findAll);

// Retrieve a Specific User
variation.get("/:id", verifyToken, controller.findOne);

// Update a User with Id
variation.put("/:id", controller.update);

// Create a User
variation.post("/", controller.create);

// Update all Variations with Id
variation.put("/", controller.update);

// Delete a User with Id
variation.delete("/:id", controller.remove);

export default variation;
