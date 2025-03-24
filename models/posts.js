'use strict';

import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class POSTS extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      POSTS.belongsTo(models.USERS,{foreignKey:"userId"})
    }
  }
  POSTS.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    userid: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'POSTS',
    
  });
  return POSTS;
};