module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Comment', {
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      postId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Post',
          key: 'uuid',
          as: 'postId'
        }
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
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: false
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
    await queryInterface.dropTable('Comment');
  }
};
