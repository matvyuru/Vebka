// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Импортируем sequelize

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false, // Обязательное поле
  },
  name: {
    type: DataTypes.STRING(100), // Ограничение по длине
    allowNull: false, // Поле может быть пустым
  },
  email: {
    type: DataTypes.STRING(100), // Ограничение по длине
    allowNull: false, // Обязательное поле
    unique: false, // Уникальное поле
  },
  createdat: {
    type: DataTypes.DATE, // Используем DATEONLY для соответствия типу в SQL
    defaultValue: DataTypes.NOW, // Дата регистрации по умолчанию
  },
}, {
  tableName: 'users', // Имя таблицы в базе данных
  timestamps: false, // Отключаем автоматическое добавление полей createdAt и updatedAt
});

// Синхронизация модели с базой данных
User .sync();

module.exports = User;
