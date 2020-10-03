import 'reflect-metadata';
import {injectable} from "inversify";
import {IPrice, Price} from "./prices.model";
import {IOption} from "../variations/variation.model";

@injectable()
export class PricesPersistence {
  public async getPrices(categoryId?: number) {
    const whereRequest = categoryId ? {where: {categoryId}} : {};
    return Price.findAll({...whereRequest, raw: true});
  }

  public async updatePrices(categoryId: number, variationId: number, options: IOption[]) {
    const pricesRecords: IPrice[] = options.map(option => ({categoryId, variationId, optionId: option.id, price: option.price}));
    const pricesPromises = pricesRecords.map(priceRec => this.createOrUpdatePromise(priceRec));

    try {
      const result = await Promise.all(pricesPromises);
      console.log('1111!!!', result);
      return result;
    } catch (error) {
      console.log(error);
    }

  }

  private async createOrUpdatePromise(priceRec: IPrice) {
    const item = await Price.findOne({
      where: {categoryId: priceRec.categoryId, variationId: priceRec.variationId, optionId: priceRec.optionId}
    });
    return item ? Price.update(priceRec, {
        where: {categoryId: priceRec.categoryId, variationId: priceRec.variationId, optionId: priceRec.optionId}
      }) :
      Price.create(priceRec)
  };


}
