import * as bcrypt from "bcrypt";
import { Request, Response } from "express";
import * as jwt from "jwt-then";
import { MongoClient } from "mongodb";
import config from "../../config/config";
import Variation from "./variation.model";

export default class UserController {
  public findAll = async (req: Request, res: Response): Promise<any> => {
    try {
      const variations = await Variation.find();

      if (!variations) {
        return res.status(404).send({
          success: false,
          message: "Users not found",
          data: null
        });
      }

      res.status(200).send(variations);
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.toString()
      });
    }
  };

  public findOne = async (req: Request, res: Response): Promise<any> => {
    try {
      const user = await Variation.findById(req.params.id);
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found",
          data: null
        });
      }

      res.status(200).send({
        success: true,
        data: user
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
    const variation = req.body;

    const variationEntity = new Variation({ ...variation });
    const savedVariation = await variationEntity.save();
    if (!savedVariation) {
      return res.status(404).send({
        success: false,
        message: "Something wrong",
        data: null
      });
    }
    res.status(200).send({
      success: true,
      data: savedVariation
    });
  };

  public update = async (req: Request, res: Response): Promise<any> => {
    const variations = req.body;
    const variationsToUpdate = [];
    const variationsToCreate = [];

    variations.forEach(variation => {
      (!variation.id || /^temp_/.test(variation.id)
        ? variationsToCreate
        : variationsToUpdate
      ).push(variation);
    });

    const createPromises = variationsToCreate.map(variation =>
      new Variation({ ...variation }).save()
    );
    const updatePromises = variationsToUpdate.map(variation =>
      Variation.findByIdAndUpdate(variation.id, variation, { new: true })
    );

    const result = await Promise.all(createPromises.concat(updatePromises));

    return res.status(200).send(result.map(variation => variation.toJSON()));

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
    res.status(200).send({
      success: true,
      data: variations
    });
  };

  public remove = async (req: Request, res: Response): Promise<any> => {
    try {
      const user = await Variation.findByIdAndRemove(req.params.id);

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
