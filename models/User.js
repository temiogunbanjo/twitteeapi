const { Model, UUIDV4 } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  /**
   * @class
   */
  class User extends Model {
    /**
     * @method
     * @description Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     * @param {*} models
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post, {
        foreignKey: 'userId'
      });

      User.hasMany(models.Comment, {
        foreignKey: 'userId'
      });
    }
  }

  User.init({
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
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hasVerifiedEmail: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'User',
    freezeTableName: true
  });
  return User;
};
