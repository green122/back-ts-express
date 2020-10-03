import {Router} from "express";
import {injectable} from 'inversify';
// import verifyToken from "../../helpers/verifyToken";
import {CartController} from "./cart.controller";

@injectable()
export class CartRoute {
  private cart: Router = Router();

  public get cartRoute() {
    return this.cart;
  }

  constructor(private controller: CartController) {
    this.configureRoute();
  }

  private configureRoute() {
    // Retrieve all Users
    // this.cart.get("/", this.controller.findAll);

    // Retrieve a Specific User
    this.cart.get("/", this.controller.findOne);

    // Update a User with Id
    // this.cart.put("/:id", this.controller.update);

    // Create a User
    this.cart.post("/", this.controller.create);

    this.cart.put("/", this.controller.update);

    // Delete a User with Id
    // this.cart.delete("/:id", this.controller.remove);
  }
}
