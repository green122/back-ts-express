import {Request, Response} from "express";
import {injectable} from 'inversify';
import {Category} from "./category.model";
import {CategoryVariation, IVariationRequest, OptionVariation, Variation} from "../variations/variation.model";
import {Op} from "sequelize";
import {PricesDomain} from "../prices/prices.domain";
import {CategoryPersistence} from "./category.persistence";

type  AnyRecord = { [key: string]: any }

interface IRawPrice {
  categoryId: number;
  variationId: number;
  optionId: number;
  price: number;
}

interface IOption {
  id: number;
  name: string;
  price?: number;
}

export interface IVariation {
  id: number;
  variation: string;
  options: IOption[];
  varyPrice?: boolean;
}


export interface ICategory {
  id: number;
  name: string;
  variations: IVariation[];
}

@injectable()
export default class CategoryController {o

  constructor(private pricesDomain: PricesDomain,
              private categoryPersistence: CategoryPersistence
  ) {
  }

  public findAll = async (req: Request, res: Response): Promise<any> => {
    try {
      const dbResult = await Category.findAll(
        {
          attributes: ['id', 'name',],
          logging: console.log,
          // include: [
          //   {
          //     model: Variation, through: { attributes: ['varyPrice']}, attributes: ['id', 'variation'],
          //     include: [{
          //       model: Option, through: {attributes: []},
          //     }]
          //   },
          // ]

        });


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
  };

  public findOne = async (req: Request, res: Response): Promise<any> => {
    const categoryId = req.params.id;
    try {
     const category = await this.categoryPersistence.findCategoryById(categoryId);

      if (!category) {
        return res.status(404).send({
          success: false,
          message: "User not found",
          data: null
        });
      }

      res.status(200).send(category);
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.toString(),
        data: null
      });
    }
  };

  public create = async (req: Request, res: Response): Promise<any> => {
    const category: IVariationRequest = req.body;

    const {id, ...categoryDto} = category;
    const categoryEntity = new Category(categoryDto);
    const savedCategory = await categoryEntity.save();
    if (!savedCategory) {
      return res.status(404).send({
        success: false,
        message: "Something wrong",
        data: null
      });
    }
    res.status(200).send({
      success: true,
      data: savedCategory
    });
  };

  public update = async (req: Request, res: Response): Promise<any> => {
    const category: ICategory = req.body;

    const categoryVariations = category.variations.map(variation => ({
      categoryId: category.id,
      variationId: variation.id
    }));
    await CategoryVariation.bulkCreate(categoryVariations, {ignoreDuplicates: true});

    const variationsIdsToKeep = categoryVariations.map(({variationId}) => variationId);
    await CategoryVariation.destroy({
      where: {
        categoryId: category.id,
        variationId: {[Op.notIn]: variationsIdsToKeep}
      }
    });

    res.status(200).send();
  };

  public updateVaryPrice = async (req: Request, res: Response): Promise<any> => {
    const {categoryId, variationId, varyPrice} = req.body;

    await CategoryVariation.update({varyPrice}, {where: {categoryId, variationId}});
    res.status(200).send();
  }

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


  private groupBy(key: string): ((arr: AnyRecord[]) => AnyRecord) {
    return (arr: AnyRecord[]) => {
      const result = {};
      arr.forEach(entity => {
        if (!entity[key]) {
          return;
        }
        console.log(entity, result);
        result[entity[key]] = result[entity[key]] ? result[entity[key]].concat(entity) : [entity];
      })
      return result;
    }
  }
}
