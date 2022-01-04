const { Model, UUIDV4 } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  /**
   * @class
   */
  class Post extends Model {
    /**
     * @description Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     * @param {*} models
     */
    static associate(models) {
      // define association here
      Post.hasMany(models.Comment, {
        foreignKey: 'postId'
      });

      Post.belongsTo(models.User, {
        foreignKey: 'userId'
      });
    }
  }
  Post.init(
    {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: UUIDV4,
        primaryKey: true
      }
    },
    {
      sequelize,
      modelName: 'Post',
      freezeTableName: true
    }
  );
  return Post;
};
