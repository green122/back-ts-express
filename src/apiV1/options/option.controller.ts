import 'reflect-metadata';
import {Request, Response} from "express";
import {Variation} from "../variations/variation.model";
import {Option} from "./option.model";
import { injectable } from "inversify";

@injectable()
export class OptionController {
  public findAll = async (req: Request, res: Response): Promise<any> => {
    try {
      const dbResult = await Option.findAll(
        {
          attributes: ['id', 'name',],
          // include: [
          //   {model: Variation, through:{ attributes: []}, attributes: ['id', 'variation', 'vary_price']}
          // ]
        });

      const res1 = await  Variation.findAll();
      res.status(200).send(dbResult);

      // if (!categories) {
      //   return res.status(404).send({
      //     success: false,
      //     message: "Users not found",
      //     data: null
      //   });
      // }
      //

    } catch
      (err) {
      res.status(500).send({
        success: false,
        message: err.toString()
      });
    }
  }
  ;

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
      res.status(200).send({
        success: true,
      });
      return;
    const categories = req.body;
    const categoriesToUpdate = [];
    const categoriesToCreate = [];

    categories.forEach(category => {
      (category.id && !String(category.id).includes('temp') ? categoriesToUpdate : categoriesToCreate).push(category);
    });

    // const createPromises = categoriesToCreate.map(category =>
    // );
    // const updatePromises = categoriesToUpdate.map(category =>
    // );
    //
    // const result = await Promise.all(createPromises.concat(updatePromises));
    //
    // return res.status(200).send(result.map(category => category.toJSON()));

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
