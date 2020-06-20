import Sequelize, {Model} from 'sequelize';
import {sequelize} from "../../config/db";

class Price extends Model {
}

Price.init({
  categoryId: {
    type: Sequelize.INTEGER,
    field: 'category_id',
    primaryKey: true
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
