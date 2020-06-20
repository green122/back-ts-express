import {injectable} from "inversify";
import {CartPersistance} from "./cart.persistance";
import {OptionsDomain} from "../options/options.domain";
import {v4 as uuid} from 'uuid';
import {IAddItemDTO, OrderedItem, OrderedItemVariationOptions} from "./cart.model";
import {Listing} from "../listings/listing.model";

@injectable()
export class CartDomain {
  constructor(private cartPersistence: CartPersistance,
  ) {
  }

  public async createOrderedItem(item: IAddItemDTO): Promise<IAddItemDTO> {
    const itemWithCartId = item.cartId ? item : {...item, cartId: uuid()}
    await this.cartPersistence.createOrderedItem(itemWithCartId);
    return itemWithCartId;
  }

  public async getCartById(cartId: string): Promise<any> {
    const cart = await this.cartPersistence.findCartById(cartId);
    const pricesRequest = cart.map(item =>
      (item.get('orderedItemVariations') as OrderedItemVariationOptions[]).map(
        variationOption => ({categoryId: (item.get('listing') as Listing).get('categoryId'), variationId: variationOption.get('variationId'), optionId: variationOption.get('optionId') })
      )
    );
    console.log(pricesRequest);
    return cart;
  }

  // public async updateVariationAndOptions(variation: IVariationRequest) {
  //   const optionsToCreate: IOption[] = [];
  //   const optionsToUpdate: IOption[] = [];
  //   variation.options.forEach(option => {
  //     if (String(option.id).includes('temp')) {
  //       optionsToCreate.push(option);
  //     } else {
  //       optionsToUpdate.push(option);
  //     }
  //   });
  //
  //   await Promise.all([
  //     this.variationPersistance.updateOptionsVariations(variation, optionsToUpdate),
  //     this.optionsDomain.createOptions(optionsToCreate),
  //     this.variationPersistance.updateVariation(variation)
  //   ]);
  // }
}
