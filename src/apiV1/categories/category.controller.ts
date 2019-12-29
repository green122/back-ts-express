import { Request, Response } from "express";
import Category from "./category.model";

export default class CategoryController {
  public findAll = async (req: Request, res: Response): Promise<any> => {
    try {
      const categories = await Category.find();

      if (!categories) {
        return res.status(404).send({
          success: false,
          message: "Users not found",
          data: null
        });
      }

      res.status(200).send(categories);
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.toString()
      });
    }
  };

  public findOne = async (req: Request, res: Response): Promise<any> => {
    try {
      const user = await Category.findById(req.params.id);
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

    const variationEntity = new Category({ ...variation });
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
    const categories = req.body;
    const categoriesToUpdate = [];
    const categoriesToCreate = [];

    categories.forEach(category => {
      (category.id ? categoriesToUpdate : categoriesToCreate).push(category);
    });

    const createPromises = categoriesToCreate.map(category =>
      new Category({ ...category }).save()
    );
    const updatePromises = categoriesToUpdate.map(category =>
      Category.findByIdAndUpdate(category.id, category, { new: true })
    );

    const result = await Promise.all(createPromises.concat(updatePromises));

    return res.status(200).send(result.map(category => category.toJSON()));

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
      const user = await Category.findByIdAndRemove(req.params.id);

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
