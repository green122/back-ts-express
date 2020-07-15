import * as mongoose from "mongoose";
import Sequelize, {Model} from "sequelize";
import {sequelize} from "../../config/db";
import {Option, Price} from "../options/option.model";
import {OptionVariation, Variation} from "../variations/variation.model";
import {Category} from "../categories/category.model";
const Schema = mongoose.Schema;

class Listing extends Model {
}

Listing.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.TEXT,
  },
  description: {
    type: Sequelize.TEXT,
  },
  categoryId: {
    type: Sequelize.INTEGER,
    field: 'category_id'
  }
},{sequelize, modelName: 'listing', timestamps: false})

class ListingImages extends Model {
}

ListingImages.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  listingId: {
    type: Sequelize.INTEGER,
    field: 'listing_id'
  },
  url: {
    type: Sequelize.STRING,
  },
  urlPreview: {
    type: Sequelize.STRING,
    field: 'url_preview'
  }
},{sequelize, modelName: 'images', timestamps: false})

Listing.hasMany(ListingImages, {foreignKey: 'listingId'});
Listing.hasOne(Category, {foreignKey: 'id', sourceKey: 'categoryId'});
ListingImages.belongsTo(Listing);

export {Listing, ListingImages}



