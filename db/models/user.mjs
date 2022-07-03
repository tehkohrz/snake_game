export default function initUserModel(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    highScore: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    settings: {
      allowNull: false,
      type: DataTypes.JSON,
    },
    // background_color: {
    //   type: DataTypes.STRING,
    // },
    // snake_color: {
    //   type: DataTypes.STRING,
    // },
    // high_score: {
    //   type: DataTypes.INTERGER,
    //   defaultValue: 0,
    // },
    // field_size: {
    //   type: DataTypes.INTERGER,
    // },
    // snake_speed: {
    //   type: DataTypes.INTERGER,
    // },
    // created_at and updated_at are required
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }, {
    // The underscored option makes Sequelize reference snake_case names in the DB.
    underscored: true,
  });
}
