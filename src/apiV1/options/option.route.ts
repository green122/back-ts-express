import {Router} from "express";
import {injectable} from "inversify";
import {OptionController} from "./option.controller";

@injectable()
export class OptionRoute {
  private option: Router = Router();

  public get optionRoute() {
    return this.option;
  }

  constructor(private controller: OptionController) {
    this.configureRoute();
  }

  private configureRoute() {
// Retrieve all Options
    this.option.get("/", this.controller.findAll);

// Retrieve a Specific User
// option.get("/:id", verifyToken, controller.findOne);

// Update a User with Id
    this.option.put("/:id", this.controller.update);

// Create a User
// option.post("/", controller.create);

// Update all Variations with Id
    this.option.put("/", this.controller.update);

// Delete a User with Id
    this.option.delete("/:id", this.controller.remove);
  }
}
