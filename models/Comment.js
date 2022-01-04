const { Model, UUIDV4 } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  /**
   * @class
   */
  class Comment extends Model {
    /**
     * @method
     * @description Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     * @param {*} models
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.Post, {
        foreignKey: 'postId',
      });

      Comment.belongsTo(models.User, {
        foreignKey: 'userId'
      });
    }
  }

  Comment.init(
    {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Comment',
      freezeTableName: true
    }
  );
  return Comment;
};
