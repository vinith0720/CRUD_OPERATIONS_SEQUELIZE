'use strict';

import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Define associations
     */
    static associate(models) {
      // Ensure model names match
      Post.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    }
  }

  Post.init(
    {
      title: { type: DataTypes.STRING, allowNull: false },
      content: { type: DataTypes.STRING, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false }, // Fix field name (camelCase)
    },
    {
      sequelize,
      modelName: "Post", // Ensure consistent model name
      tableName :"post"
    }
  );

  return Post;
};
