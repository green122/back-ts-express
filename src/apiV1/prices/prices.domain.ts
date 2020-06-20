import { injectable } from "inversify";
import {IOption} from "../variations/variation.model";
import {PricesPersistence} from "./prices.persistence";

@injectable()
export class PricesDomain {
  constructor(private pricesPersistence: PricesPersistence) {
  }
  public async getPrices(categoryId?: string) {
      return this.pricesPersistence.getPrices(Number(categoryId));
  }
  public async updatePrices(categoryId: string, variationId:string, options: IOption[]) {
    return this.pricesPersistence.updatePrices(Number(categoryId), Number(variationId), options);
  }
}
