import 'reflect-metadata';
import {injectable} from "inversify";
import {Request, Response} from "express";
import {PricesDomain} from "./prices.domain";

@injectable()
export class PricesController {

  constructor(private pricesDomain: PricesDomain) {
  }

  public findAll = async (req: Request, res: Response): Promise<any> => {
    const result = await this.pricesDomain.getPrices();
    res.status(200).send(result);
  }

  public findByCategory = async (req: Request, res: Response): Promise<any> => {
    const {categoryId} = req.params;
    const result = await this.pricesDomain.getPrices(categoryId);
    res.status(200).send(result);
  }

  // public findOne = async (req: Request, res: Response): Promise<any> => {
  //   try {
  //     const user = null;
  //     if (!user) {
  //       return res.status(404).send({
  //         success: false,
  //         message: "User not found",
  //         data: null
  //       });
  //     }
  //
  //     res.status(200).send({
  //       success: true,
  //       data: user
  //     });
  //   } catch (err) {
  //     res.status(500).send({
  //       success: false,
  //       message: err.toString(),
  //       data: null
  //     });
  //   }
  // };

  // public create = async (req: Request, res: Response): Promise<any> => {
  //   const variation = req.body;
  //
  //   const categoryEntity = null;
  //   const savedVariation = await categoryEntity.save();
  //   if (!savedVariation) {
  //     return res.status(404).send({
  //       success: false,
  //       message: "Something wrong",
  //       data: null
  //     });
  //   }
  //   res.status(200).send({
  //     success: true,
  //     data: savedVariation
  //   });
  // };

  public update = async (req: Request, res: Response): Promise<any> => {
    const {categoryId, variationId, options} = req.body;

    await this.pricesDomain.updatePrices(categoryId, variationId, options);

    return res.status(200).send();

    // try {
    //   const userUpdated = await Variation.findByIdAndUpdate(
    //     req.params.id,
    //     {
    //       $set: {
    //         name,
    //         lastName,
    //         email,
    //         password
    //       }
    //     },
    //     { new: true }
    //   );
    //   if (!userUpdated) {
    //     return res.status(404).send({
    //       success: false,
    //       message: "User not found",
    //       data: null
    //     });
    //   }
    //   res.status(200).send({
    //     success: true,
    //     data: userUpdated
    //   });
    // } catch (err) {
    //   res.status(500).send({
    //     success: false,
    //     message: err.toString(),
    //     data: null
    //   });
    // }
  };

  public remove = async (req: Request, res: Response): Promise<any> => {
    try {
      const user = null;

      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found",
          data: null
        });
      }
      res.status(204).send();
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.toString(),
        data: null
      });
    }
  };
}
