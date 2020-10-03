import Sequelize, {Model} from 'sequelize';
import {sequelize} from "../../config/db";

class Price extends Model {
}

export interface IPrice {
  categoryId: number;
  variationId: number;
  optionId: number;
  price: number;
}

Price.init({
  categoryId: {
    type: Sequelize.INTEGER,
    field: 'category_id',
  },
  variationId: {
    type: Sequelize.INTEGER,
    field: 'variation_id'
  },
  optionId: {
    type: Sequelize.INTEGER,
    field: 'option_id'
  },
  price: {
    type: Sequelize.INTEGER,
  }
},{sequelize, modelName: 'prices', timestamps: false})


export {Price};
