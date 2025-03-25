'use strict';

import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Define associations
     */
    static associate(models) {
      // Ensure the model name matches
      User.hasMany(models.Post, { foreignKey: "userId", as: "posts" });
    }
  }

  User.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      age: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "User", // Ensure consistent model name (PascalCase)
      tableName:"user"
    }
  );

  return User;
};
