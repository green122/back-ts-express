import Sequelize, {Model} from 'sequelize';
import {sequelize} from "../../config/db";
import {CategoryVariation, Variation} from "../variations/variation.model";

class Category extends Model {
}

Category.init({
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {sequelize, modelName: 'categories', timestamps: false}
);

Category.hasMany(Variation);
Category.belongsToMany(Variation, { through: CategoryVariation, foreignKey: 'categoryId'});
Variation.belongsToMany(Category, {through: CategoryVariation,  foreignKey: 'variationId'});

export {Category};
