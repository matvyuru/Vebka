const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan'); // Импортируем morgan
const sequelize = require('./config/db'); // Импортируем sequelize
const eventsRouter = require('./routes/events');
const usRouter = require('./routes/users');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 2000;

// Middleware
app.use(bodyParser.json());
app.use(morgan(':method :url')); // Логирование метода и пути запроса

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API Documentation for Events and Users',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./backend/routes/*.js'], // Укажите путь к вашим маршрутам
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
