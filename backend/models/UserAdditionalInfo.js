const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Импортируем sequelize

const UserAdditionalInfo = sequelize.define('User AdditionalInfo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // Имя таблицы, к которой ссылаемся
      key: 'id',
    },
  },
  lastIPs: {
    type: DataTypes.JSONB, // Используем JSONB для хранения массива IP-адресов
    defaultValue: [], // По умолчанию пустой массив
  },
  lastUserAgents: {
    type: DataTypes.JSONB, // Используем JSONB для хранения массива User-Agent
    defaultValue: [], // По умолчанию пустой массив
  },
}, {
  tableName: 'user_additional_info', // Имя таблицы в базе данных
  timestamps: true, // Включаем timestamps, если нужно
});

module.exports = UserAdditionalInfo;
