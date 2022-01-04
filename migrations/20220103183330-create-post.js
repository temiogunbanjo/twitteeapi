module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Post', {
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      image: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      caption: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      numberOfLikes: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      posterName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'User',
          key: 'uuid',
          as: 'userId'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Post');
  }
};
