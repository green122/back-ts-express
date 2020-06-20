import Sequelize, {Model} from "sequelize";
import {sequelize} from "../../config/db";
import {Category} from "../categories/category.model";
import {Option} from "../options/option.model";
import {Listing} from "../listings/listing.model";
import {Variation} from "../variations/variation.model";

export interface IAddItemDTO {
  cartId?: string;
  listingId: number;
  optionsVariations: IVariationOptions[];
}

export interface IVariationOptions {
  variationId: string;
  optionId: string;
}

class OrderedItem extends Model {
}

OrderedItem.init(
  {
    cartId: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'cart_id'
    },
    listingId: {
      type: Sequelize.NUMBER,
      allowNull: false,
      field: 'listing_id'
    },
    amount: {
      type: Sequelize.NUMBER,
      allowNull: false
    },
    createdAt: {
      field: 'created_at',
      type: Sequelize.DATE,
    },
    updatedAt: {
      field: 'updated_at',
      type: Sequelize.DATE,
    },
  }, {sequelize, modelName: 'ordered_items', timestamps: true,}
);

class OrderedItemVariationOptions extends Model {
}

OrderedItemVariationOptions.init(
  {
    orderedItemId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'ordered_item_id',
      primaryKey: true
    },
    variationId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'variation_id',
      primaryKey: true
    },
    optionId: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      field: 'option_id',
      primaryKey: true
    },
  }, {sequelize, modelName: 'ordered_item_variation_options', timestamps: false,}
);


OrderedItem.hasMany(OrderedItemVariationOptions, {foreignKey: 'orderedItemId', as: 'orderedItemVariations'})
OrderedItem.hasOne(Listing, {sourceKey: 'listingId', foreignKey: 'id'})
OrderedItemVariationOptions.hasOne(Variation, {sourceKey: 'variationId', foreignKey: 'id'});
OrderedItemVariationOptions.hasOne(Option, {sourceKey: 'optionId', foreignKey: 'id'});
export {OrderedItem, OrderedItemVariationOptions};
