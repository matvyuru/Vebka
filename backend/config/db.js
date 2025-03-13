// config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config(); // Загружаем переменные окружения из .env файла

// Создаем экземпляр Sequelize с параметрами подключения из переменных окружения
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'postgres', // Указываем, что используем PostgreSQL
  port: process.env.DB_PORT,
  logging: console.log, // Включаем логирование SQL-запросов (по желанию)
});

// Проверяем подключение к базе данных
const testConnection = async () => {
  try {
    await sequelize.authenticate(); // Пытаемся установить соединение
    console.log('Соединение с базой данных успешно установлено!');
  } catch (error) {
    console.error('Не удалось установить соединение с базой данных:', error);
  }
};

// Вызываем функцию для проверки соединения
testConnection();

module.exports = sequelize; // Экспортируем экземпляр Sequelize
