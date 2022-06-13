module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      settings: {
        allowNull: false,
        type: Sequelize.JSON,
      },
      // background_color: {
      //   type: Sequelize.STRING,
      // },
      // snake_color: {
      //   type: Sequelize.STRING,
      // },
      // high_score: {
      //   type: Sequelize.INTERGER,
      //   defaultValue: 0,
      // },
      // field_size: {
      //   type: Sequelize.INTERGER,
      // },
      // snake_speed: {
      //   type: Sequelize.INTERGER,
      // },
      // created_at and updated_at are required
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable('scores', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      score: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('scores');
  },
};
