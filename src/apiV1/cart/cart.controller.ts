import {Request, Response} from "express";
// import { MongoClient } from "mongodb";
// import config from "../../config/config";
import {Option} from "../options/option.model";
import  {Op} from 'sequelize';
import { injectable } from "inversify";
import {CartDomain} from "./cart.domain";
import {IAddItemDTO} from "./cart.model";


@injectable()
export class CartController {

  constructor(private cartDomain: CartDomain) {
  }

  // public findAll = async (req: Request, res: Response): Promise<any> => {
  //   try {
  //     const dbResult = await Variation.findAll(
  //       {
  //         attributes: ['id', 'variation'],
  //         include: [
  //           {model: Option, attributes: ['id', 'name']}
  //         ]
  //       });
  //     res.status(200).send(dbResult);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  public findOne = async (req: Request, res: Response): Promise<any> => {
    const cartId = req.params.id;
    try {

      const cart = await this.cartDomain.getCartById(cartId);
      res.status(200).send({
        success: true,
        data: cart
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.toString(),
        data: null
      });
    }
  };

  public create = async (req: Request, res: Response): Promise<any> => {
    const item: IAddItemDTO = req.body;

    const savedItem = await  this.cartDomain.createOrderedItem(item)
    if (!savedItem) {
      return res.status(404).send({
        success: false,
        message: "Something wrong",
        data: null
      });
    }
    res.status(200).send({
      success: true,
      data: savedItem
    });
  };

  // public update = async (req: Request, res: Response): Promise<any> => {
  //   const variation: IVariationRequest = req.body;
  //
  //   await this.variationDomain.updateVariationAndOptions(variation);
  //
  //   res.status(200).send({
  //     success: true,
  //   });
  // };
  //
  // public remove = async (req: Request, res: Response): Promise<any> => {
  //   try {
  //     const user = await Variation.findByPk(req.params.id);
  //
  //     if (!user) {
  //       return res.status(404).send({
  //         success: false,
  //         message: "User not found",
  //         data: null
  //       });
  //     }
  //     res.status(204).send();
  //   } catch (err) {
  //     res.status(500).send({
  //       success: false,
  //       message: err.toString(),
  //       data: null
  //     });
  //   }
  // };
}
