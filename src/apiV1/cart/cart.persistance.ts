import {injectable} from "inversify";
import {Op} from "sequelize";
import {
  IAddItemDTO,
  OrderedItem,
  OrderedItemVariationOptions,
} from "./cart.model";
import {Listing} from "../listings/listing.model";
import {Category} from "../categories/category.model";
import {Variation} from "../variations/variation.model";
import {Option} from "../options/option.model";
import {Price} from "../prices/prices.model";

@injectable()
export class CartPersistance {

  public async createOrderedItem(item: IAddItemDTO) {
    const createdItem = await OrderedItem.create(item);
    const itemId = createdItem.get('id');
    const optionsVariation = item.optionsVariations.map(entity => ({...entity, orderedItemId: itemId, optionId: Number(entity.optionId)}));
    // await Promise.all(optionsVariation);
    await OrderedItemVariationOptions.bulkCreate(optionsVariation);
  }

  public async findCartById(cartId: string) {
    const cart = await OrderedItem.findAll({
      where: {cartId}, include: [
        {model: Listing, include: [{model: Category}]},
        {
          model: OrderedItemVariationOptions, as: 'orderedItemVariations', include: [
            {model: Variation},
            {model: Option, include: [{ model: Price}]}
          ]
        }
      ]
    });
    return cart;
  }


  // public async updateOptionsVariations(variation: IVariationRequest, options: IOption[]) {
  //   const optionVariations = options.map(option => ({optionId: option.id, variationId: variation.id}));
  //   await OptionVariation.bulkCreate(optionVariations, {ignoreDuplicates: true});
  //
  //   const optionIdsToDelete = optionVariations.map(({optionId}) => optionId);
  //   console.log(optionIdsToDelete, optionVariations);
  //   await OptionVariation.destroy({
  //     where: {
  //       variationId: variation.id,
  //       optionId: {[Op.notIn]: optionIdsToDelete}
  //     }
  //   });
  // }
  //
  // public async updateVariation(variation: IVariationRequest) {
  //   await Variation.update({variation: variation.name, vary_price: variation.varyPrice}, {
  //     where: {
  //       id: variation.id
  //     },
  //     returning: true,
  //   });
  // }
}
