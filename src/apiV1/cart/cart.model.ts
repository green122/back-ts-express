import Sequelize, {Model} from "sequelize";
import {sequelize} from "../../config/db";
import {Category} from "../categories/category.model";
import {Option} from "../options/option.model";
import {Listing} from "../listings/listing.model";
import {Variation} from "../variations/variation.model";
import {IOrderedListing} from "../listings/listing.domain";

export interface IAddItemDTO {
  cartId?: string;
  listingId: number;
  orderedItemId?: number;
  amount: number;
  variationsOptions: IVariationOptions[];
}

export interface ICartItemDTO {
  listing: IOrderedListing;
  orderedItemId?: number;
  amount: number;
  price: number;
  variationsOptions: IVariationOptions[];
}

export interface ICartDTO {
  total: number;
  items: ICartItemDTO[];
}

export interface IVariationOptions {
  variationId: string;
  optionId: string;
}

class Cart extends Model {
}

Cart.init({
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'id',
    primaryKey: true
  },
  userId: {
    type: Sequelize.NUMBER,
    allowNull: true,
    field: 'user_id',
  },
}, {sequelize, modelName: 'carts', timestamps: true,})

class OrderedItem extends Model {
}

OrderedItem.init(
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      primaryKey: true,
      autoIncrement: true,
      autoIncrementIdentity: true
    },
    cartId: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'cart_id'
    },
    listingId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'listing_id'
    },
    amount: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'amount'
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
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'option_id',
      primaryKey: true
    },
  }, {sequelize, modelName: 'ordered_item_descriptions', timestamps: false,}
);


Cart.hasMany(OrderedItem, {foreignKey: 'cart_id'});
OrderedItem.hasMany(OrderedItemVariationOptions, { foreignKey: 'orderedItemId', as: 'orderedVariations'})
OrderedItem.hasOne(Listing, {sourceKey: 'listingId', foreignKey: 'id'})
OrderedItemVariationOptions.hasOne(Variation, {sourceKey: 'variationId', foreignKey: 'id'});
OrderedItemVariationOptions.hasOne(Option, {sourceKey: 'optionId', foreignKey: 'id'});

export {OrderedItem, OrderedItemVariationOptions, Cart};
