import Sequelize, {Model} from 'sequelize';
import {sequelize} from "../../config/db";

class User extends Model {
}

User.init({
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true
    },
    registrationType: {
      type: Sequelize.STRING,
      field: 'registration_type',
      allowNull: false
    },
    avatarUrl: {
      type: Sequelize.STRING,
      field: 'avatar_url',
      allowNull: true
    },
    refreshToken: {
      type: Sequelize.STRING,
      field: 'refresh_token',
      allowNull: true
    }
  }, {
    sequelize, modelName: 'users', timestamps: false, scopes: {
      mainInfo: {
        attributes: {exclude: ['password', 'refreshToken', 'registrationType']},
      }
    }
  }
);

export {User};
