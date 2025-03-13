// models/Event.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Импортируем sequelize

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(100), // Ограничение по длине
    allowNull: false, // Обязательное поле
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false, // Обязательное поле
    defaultValue: DataTypes.NOW, // Значение по умолчанию
  },
  descpription: {
    type: DataTypes.STRING(1000), // Поле для описания
    allowNull: true, // Необязательное поле
  },
  createdby: {
    type: DataTypes.INTEGER,
    allowNull: false, // Обязательное поле
  },
}, {
  tableName: 'events', // Имя таблицы в базе данных
  timestamps: false,
});

// Экспортируем модель
module.exports = Event;
