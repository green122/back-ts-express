import "reflect-metadata";
import {injectable} from 'inversify';

import {Category} from "./category.model";
import {Variation} from "../variations/variation.model";
import {Option} from "../options/option.model";
import {ICategory} from "./category.controller";
import {PricesDomain} from "../prices/prices.domain";

interface IRawPrice {
  categoryId: number;
  variationId: number;
  optionId: number;
  price: number;
}

@injectable()
export class CategoryPersistence {

  constructor(private pricesDomain: PricesDomain) {
  }

  public async findCategoryById(categoryId: string) {

    const dbCategory = await Category.findAll(
      {
        where: {id: categoryId},
        include: [
          {
            model: Variation, through: {attributes: ['varyPrice']}, attributes: ['id', 'variation'],
            include: [{
              model: Option, through: {attributes: []},
            }]
          },
        ]
      });

    const category: ICategory = JSON.parse(JSON.stringify(dbCategory))[0];
    const prices: IRawPrice[] = await this.pricesDomain.getPrices(categoryId) as unknown as IRawPrice[];

    prices.forEach((price) => {
      const variation = category.variations?.find(({id}) => id === price.variationId);
      const option = variation?.options?.find(({id}) => id === price.optionId);
      if (!option) {
        return;
      }
      option.price = price.price;
    })

    category.variations.forEach(variation => {
      variation.varyPrice = (variation as any).category_variations.varyPrice;
      delete (variation as any).category_variations;
    })
    return category;
  }


}
