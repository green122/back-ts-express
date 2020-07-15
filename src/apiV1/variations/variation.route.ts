import {Router} from "express";
import {injectable} from 'inversify';
import verifyToken from "../../helpers/verifyToken";
import {VariationController} from "./variation.controller";

@injectable()
export class VariationRoute {
  private variation: Router = Router();

  public get variationRoute() {
    return this.variation;
  }

  constructor(private controller: VariationController) {
    this.configureRoute();
  }

  private configureRoute() {
    // Retrieve all Users
    this.variation.get("/", this.controller.findAll);

    // Retrieve a Specific User
    this.variation.get("/:id", verifyToken, this.controller.findOne);

    // Update a User with Id
    this.variation.put("/:id", this.controller.update);

    // Create a User
    this.variation.post("/", this.controller.create);

    // Update all Variations with Id
    this.variation.put("/", this.controller.update);

    // Delete a User with Id
    this.variation.delete("/:id", this.controller.remove);
  }
}
