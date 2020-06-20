import Sequelize, {Model} from 'sequelize';
import {sequelize} from "../../config/db";
import {Price} from "../prices/prices.model";

class Option extends Model {
}

Option.init({
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
  }, {sequelize, modelName: 'options', timestamps: false}
);


Option.hasOne(Price, {sourceKey: 'id', foreignKey: 'optionId'})

export {Option};
