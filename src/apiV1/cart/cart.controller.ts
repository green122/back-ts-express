import {Request, Response} from "express";
import {v4 as uuid} from 'uuid';

// import { MongoClient } from "mongodb";
// import config from "../../config/config";
import {Option} from "../options/option.model";
import {Op} from 'sequelize';
import {injectable} from "inversify";
import {CartDomain} from "./cart.domain";
import {IAddItemDTO} from "./cart.model";
import httpStatus from "http-status";


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
    const {cartId} = req.cookies;
    if (!cartId) {
     return res.status(404).send({
        success: false,
        message: 'no saved cart',
        data: null
      });
    }
    try {
      const cart = await this.cartDomain.getCartById(cartId);
      res.status(200).send(cart);
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
    let {cartId} = req.cookies;

    if (!cartId) {
      cartId = await this.cartDomain.createCard();
      res.cookie('cartId', cartId, );
    }

    const savedItem = await this.cartDomain.createOrderedItem({...item, cartId});
    if (!savedItem) {
      return res.status(404).send({
        success: false,
        message: "Something wrong",
        data: null
      });
    }
    res.status(200).send(
      savedItem
    );
  };

  public update = async (req: Request, res: Response): Promise<any> => {
    const item: IAddItemDTO = req.body;
    const {cartId} = req.cookies;
    if (!cartId) {
      return res.status(httpStatus.BAD_REQUEST).send({
        success: false,
        message: "Cart id wasn't provided",
      });
    }

    const updatedItem = await this.cartDomain.updateCart({...item, cartId});
    if (!updatedItem) {
      return res.status(404).send({
        success: false,
        message: "Something wrong",
        data: null
      });
    }

    res.status(200).send(
      updatedItem
    );
  }
}
