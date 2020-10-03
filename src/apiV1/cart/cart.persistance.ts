import {injectable} from "inversify";
import {Op} from "sequelize";
import {
  Cart,
  IAddItemDTO,
  OrderedItem,
  OrderedItemVariationOptions,
} from "./cart.model";
import {pool, sequelize} from "../../config/db";
import {groupBy, KeyMap} from "../../helpers/groupBy";

type DataRow = {
  amount: number;
  id: number;
  imageid: number;
  listingid: number;
  categoryid: number;
  ordered_variationid: number;
  ordered_optionid: number;
  categoryname: string;
  description: string;
  listingname: string;
  url: string;
  urlpreview: string;
  variationname: string;
  variationid: number;
  optionid: number;
  optionname: string;
  price: number;
};

const keyMap: KeyMap<DataRow> = {
  groupKey: 'id',
  fields: ['id', 'amount',],
  nested: [
    {
      groupKey: 'listingid',
      oneToOne: true,
      groupName: 'listing',
      fields: [['listingname', 'listingName'], 'description'],
      nested: [{
        groupKey: 'imageid',
        groupName: 'images',
        fields: ['url', ['urlpreview', 'urlPreview']]
      }, {
        groupName: 'category',
        oneToOne: true,
        groupKey: 'categoryid',
        fields: [['categoryname', 'categoryName']],
        nested: {
          groupKey: 'variationid',
          fields: [['variationid', 'id'], ['variationname', 'variation']],
          groupName: 'variations',
          nested: {
            groupKey: 'optionid',
            fields: [['optionid', 'id'], ['optionname', 'name'], 'price'],
            groupName: 'options'
          }
        }
      }]
    },
    {
      groupKey: 'ordered_variationid',
      groupName: 'orderedVariations',
      fields: [['ordered_variationid', 'variationId'], ['ordered_optionid', 'optionId']]
    },
  ]
}


@injectable()
export class CartPersistance {

  public async createCard(cartId: string) {
    const cart = await Cart.create({id: cartId});
  }

  public async createOrderedItem(item: IAddItemDTO) {
    let createdItem: OrderedItem;
    try {
      createdItem = await OrderedItem.create({listingId: item.listingId, cartId: item.cartId, amount: item.amount});
    } catch (e) {
      console.log(e);
    }
    const itemId = createdItem.get('id');
    const optionsVariation = item.variationsOptions.map(entity => ({
      ...entity,
      orderedItemId: itemId,
      optionId: Number(entity.optionId)
    }));
    await Promise.all(optionsVariation);
    await OrderedItemVariationOptions.bulkCreate(optionsVariation);
    return createdItem;
  }

  public async findCartById(cartId: string) {
    let cart: any;
    try {

      const {rows} = await pool.query(`
      SELECT
        amount, ordered_items.id AS id,
        listings.name AS listingname,
        listings.id AS listingid,
        listings.description AS description,
        ordered_item_descriptions.variation_id AS ordered_variationid,
        ordered_item_descriptions.option_id AS ordered_optionid,
        images.id AS imageid,
        images.url AS url,
        images.url_preview AS urlpreview,
        categories.id AS categoryid,
        categories.name AS categoryName,
        variations.variation AS variationName,
        variations.id AS variationId,
        options.id AS optionId,
        options.name AS optionName,
        prices.price AS price
        FROM ordered_items
        LEFT JOIN listings ON listing_id=listings.id
        LEFT JOIN ordered_item_descriptions ON ordered_items.id = ordered_item_id
        LEFT JOIN images ON images.listing_id = listings.id
        LEFT JOIN categories ON category_id=listings.category_id
        LEFT JOIN category_variations ON categories.id = category_variations.category_id
                LEFT JOIN variations ON category_variations.variation_id = variations.id
                LEFT JOIN options_variations ON options_variations.variation_id = variations.id
                LEFT JOIN options ON options_variations.option_id = options.id
                LEFT JOIN prices ON prices.category_id = categories.id AND prices.variation_id = variations.id AND prices.option_id = options.id
                WHERE cart_id=$1`, [cartId]);

      cart = groupBy(rows, keyMap);
      console.log(cart);
    } catch (e) {
      console.log(e);
    }

    return cart;
  }

  public async updateCart(cartItem: IAddItemDTO) {
    if (cartItem.amount !== undefined) {
      const result = await OrderedItem.update({amount: cartItem.amount}, {
        where: {
          cartId: cartItem.cartId
        }
      });
      return result;
    }
    if (cartItem.variationsOptions && cartItem.variationsOptions.length) {
      const [variationOption] = cartItem.variationsOptions;
      try {
        const resultOption = await OrderedItemVariationOptions.update({
          optionId: variationOption.optionId,
        }, {
          where: {
            orderedItemId: cartItem.orderedItemId,
            variationId: variationOption.variationId,
          }
        })
        return resultOption;
      } catch (error) {
        console.log(error);
      }
    }
    return 0;
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
