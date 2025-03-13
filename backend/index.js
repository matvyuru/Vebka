const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/db'); // Импортируем sequelize
const eventsRouter = require('./routes/events');
const usRouter = require('./routes/users');

const app = express();
const PORT = 2000;

// Middleware
app.use(bodyParser.json());
// Используем маршруты для мероприятий
app.use('/events', eventsRouter);
app.use('/users', usRouter);

// Синхронизация моделей с базой данных
sequelize.sync()
  .then(() => {
    console.log('Синхронизация моделей завершена.');
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Ошибка синхронизации моделей:', err);
  });
