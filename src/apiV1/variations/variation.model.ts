import Sequelize, {Model} from "sequelize";
import {sequelize} from "../../config/db";
import {Category} from "../categories/category.model";
import {Option} from "../options/option.model";

export interface IVariationRequest {
  id: number;
  name: string;
  varyPrice: boolean;
  options: IOption[];
}

export interface IOption {
  id: string;
  name: string;
  price?: number;
}

class Variation extends Model {
}

Variation.init(
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    variation: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {sequelize, modelName: 'variations', timestamps: false,}
);

class CategoryVariation extends Model {
}

CategoryVariation.init(
  {
    categoryId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'category_id'
    },
    variationId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'variation_id'
    },
    varyPrice: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      field: 'vary_price'
    },
  }, {sequelize, modelName: 'category_variations', timestamps: false,}
);

class OptionVariation extends Model {
}

OptionVariation.init(
  {
    optionId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'option_id'
    },
    variationId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'variation_id'
    },
  }, {sequelize, modelName: 'option_variations', timestamps: false,}
);

Option.belongsToMany(Variation, {through: OptionVariation});
Variation.belongsToMany(Option, {through: OptionVariation});
export {Variation, CategoryVariation, OptionVariation};
