import {injectable} from "inversify";
import {CartPersistance} from "./cart.persistance";
import {OptionsDomain} from "../options/options.domain";
import {v4 as uuid} from 'uuid';
import {IAddItemDTO, ICartDTO, ICartItemDTO, OrderedItem, OrderedItemVariationOptions} from "./cart.model";
import {Listing} from "../listings/listing.model";

@injectable()
export class CartDomain {
  constructor(private cartPersistence: CartPersistance,
  ) {
  }

  public async createCard(): Promise<string> {
    const cartId = uuid().toString();
    await this.cartPersistence.createCard(cartId);
    return cartId;
  }

  public async createOrderedItem(item: IAddItemDTO): Promise<OrderedItem> {
    const created = await this.cartPersistence.createOrderedItem(item);
    return created;
  }

  public calculateCartTotal(items: ICartItemDTO[]): number {
    let total = 0;
    items.forEach(item => total += item.price * item.amount);
    return total;
  }

  public async getCartById(cartId: string): Promise<ICartDTO> {
    const cartItems = await this.cartPersistence.findCartById(cartId);
    return {
      total: this.calculateCartTotal(cartItems),
      items: cartItems
    };
  }


  public async updateCart(item: IAddItemDTO): Promise<any> {
    const result = await this.cartPersistence.updateCart(item);
    if (!result) {
      return result
    }
    const cart = await this.getCartById(item.cartId);
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
