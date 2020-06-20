import {Router} from "express";
import {injectable} from "inversify";
import {PricesController} from "./prices.controller";

@injectable()
export class PricesRoute {
  private price: Router = Router();

  public get pricesRoute() {
    return this.price;
  }

  constructor(private controller: PricesController) {
    this.configureRoute();
  }

  private configureRoute() {
// Retrieve all Options
    this.price.get("/", this.controller.findAll);

// Retrieve a Specific User
    this.price.get("/:categoryId", this.controller.findByCategory);

// Update a User with Id
    this.price.put("/:id", this.controller.update);

// Create a User
// price.post("/", controller.create);

// Update all Variations with Id
    this.price.put("/", this.controller.update);

// Delete a User with Id
    this.price.delete("/:id", this.controller.remove);
  }
}
