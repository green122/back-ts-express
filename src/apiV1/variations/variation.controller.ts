import {Request, Response} from "express";
// import { MongoClient } from "mongodb";
// import config from "../../config/config";
import {Option} from "../options/option.model";
import {Op} from 'sequelize';
import {IOption, IVariationRequest, OptionVariation, Variation} from "./variation.model";
import {injectable} from "inversify";
import {VariationDomain} from "./variation.domain";


@injectable()
export class VariationController {

  constructor(private variationDomain: VariationDomain) {
  }

  public findAll = async (req: Request, res: Response): Promise<any> => {
    try {
      const dbResult = await Variation.findAll(
        {
          attributes: ['id', 'variation'],
          include: [
            {model: Option, attributes: ['id', 'name']}
          ]
        });
      res.status(200).send(dbResult);
    } catch (err) {
    }
  };

  public findOne = async (req: Request, res: Response): Promise<any> => {
    try {
      const variation = await Variation.findByPk(req.params.id);
      if (!variation) {
        return res.status(404).send({
          success: false,
          message: "User not found",
          data: null
        });
      }

      res.status(200).send({
        success: true,
        data: variation
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
    const variation: IVariationRequest = req.body;

    const variationDto = {variation: variation.variation, vary_price: variation.varyPrice};
    const variationEntity = new Variation(variationDto);
    const savedVariation = await variationEntity.save();
    if (!savedVariation) {
      return res.status(404).send({
        success: false,
        message: "Something wrong",
        data: null
      });
    }
    res.status(200).send(savedVariation);
  };

  public update = async (req: Request, res: Response): Promise<any> => {
    const variation: IVariationRequest = req.body;

    await this.variationDomain.updateVariationAndOptions(variation);

    res.status(200).send({
      success: true,
    });
  };

  public remove = async (req: Request, res: Response): Promise<any> => {
    try {
      const variation = await Promise.all([
        Variation.destroy({
          where: {
            id: req.params.id
          }
        }),
        OptionVariation.destroy({
          where: {
            variationId: req.params.id
          }
        })]);

      if (!variation) {
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
