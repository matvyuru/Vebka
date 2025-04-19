const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Импортируем sequelize
const bcrypt = require('bcryptjs'); // Импортируем bcryptjs

const User = sequelize.define('User  ', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false, // Обязательное поле
  },
  name: {
    type: DataTypes.STRING(100), // Ограничение по длине
    allowNull: false, // Поле не может быть пустым
  },
  email: {
    type: DataTypes.STRING(100), // Ограничение по длине
    allowNull: false, // Обязательное поле
    unique: true, // Уникальное поле
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  tableName: 'users', // Имя таблицы в базе данных
  timestamps: true, // Включаем timestamps
  createdAt: 'createdAt', // Используем только createdAt
  updatedAt: false, // Отключаем updatedAt
});

// Хэширование пароля перед созданием пользователя
User .beforeCreate(async (user) => {
  try {
    user.password = await bcrypt.hash(user.password, 10);
  } catch (error) {
    console.error('Ошибка при хэшировании пароля:', error);
    throw new Error('Ошибка при создании пользователя');
  }
});

// Не вызывайте User.sync(), если используете миграции

module.exports = User;