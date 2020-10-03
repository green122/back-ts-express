import {injectable} from 'inversify';
import {Router} from "express";
import CategoryController from "./category.controller";
import verifyToken from "../../helpers/verifyToken";
import {authenticate} from "../auth/auth.middleware";

@injectable()
export class CategoryRoute {

  private category: Router = Router();

  public get categoryRoute() {
    return this.category;
  }

  constructor(private controller: CategoryController) {
    this.configureRoute();
  }

  private configureRoute() {
// Retrieve all Users
    this.category.get("/", authenticate, this.controller.findAll);

// Retrieve a Specific User
    this.category.get("/:id", this.controller.findOne);

// Update a User with Id
    this.category.put("/:id", this.controller.update);

// Create a User
    this.category.post("/", this.controller.create);

// Update all Variations with Id
    this.category.put("/", this.controller.update);

    this.category.put("/varyPrice/:categoryId", this.controller.updateVaryPrice);

// Delete a User with Id
    this.category.delete("/:id", this.controller.remove);
  }

}

