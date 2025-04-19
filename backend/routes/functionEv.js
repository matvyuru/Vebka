const Event = require('../models/Event.js');
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const getEventById = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  try {
    // Декодируем токен для проверки его валидности
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ message: 'Неверный токен' });
  }

  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Мероприятие не найдено' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении мероприятия', error: error.message });
  }
};

const createEvent = async (req, res) => {
  const { title, description } = req.body; // Исправлено название переменной на 'description'

  // Получаем токен из заголовка авторизации
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  let userId;
  try {
    // Декодируем токен и получаем userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id; // Предполагая, что id пользователя хранится в поле id
  } catch (error) {
    return res.status(401).json({ message: 'Неверный токен' });
  }

  // Проверка обязательных данных
  if (!title || !description || !userId) {
    return res.status(400).json({ message: 'Все поля обязательны' });
  }

  try {
    const newEvent = await Event.create({ title, description, createdby: userId });
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при создании мероприятия', error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id;
  } catch (error) {
    return res.status(401).json({ message: 'Неверный токен' });
  }

  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Мероприятие не найдено' });
    }

    if (event.createdby !== userId) {
      return res.status(403).json({ message: 'У вас нет прав для удаления этого мероприятия' });
    }

    await event.destroy();
    res.status(204).send(); // Успешное удаление, без тела ответа

  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении мероприятия', error: error.message });
  }
};

const updateEvent = async (req, res) => {
  const { title, description } = req.body; // Исправлено название переменной на 'description'

  // Получаем токен из заголовка авторизации
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  let userId;
  try {
    // Декодируем токен и получаем userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id; // Предполагая, что id пользователя хранится в поле id
  } catch (error) {
    return res.status(401).json({ message: 'Неверный токен' });
  }

  // Проверка обязательных данных
  if (!title || !description) {
    return res.status(400).json({ message: 'Все поля обязательны' });
  }

  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Мероприятие не найдено' });
    }

    // Проверка на соответствие id создателя и id пользователя
    if (event.createdby !== userId) {
      return res.status(403).json({ message: 'У вас нет прав для изменения этого мероприятия' });
    }

    await event.update({ title, description }); // Исправлено название переменной на 'description'
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении мероприятия', error: error.message });
  }
};


module.exports = { deleteEvent, getEventById, createEvent, updateEvent };