// routes/events.js
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize'); // Добавьте этот импорт
const Event = require('../models/Event.js');

router.get('/', async (req, res) => {
  try {
    // Получение всех событий без ограничений
    const events = await Event.findAll();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении мероприятий', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Мероприятие не найдено' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении мероприятия', error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { title, descpription, createdby } = req.body;

  // Проверка обязательных данных
  if (!title || !descpription || !createdby) {
        return res.status(400).json({ message: 'Все поля обязательны' });
  }

  try {
    const newEvent = await Event.create({ title, descpription, createdby });
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при создании мероприятия', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const { title, descpription, createdby } = req.body;

  // Проверка обязательных данных
  if (!title || !descpription || !createdby) {
    return res.status(400).json({ message: 'Все поля обязательны' });
  }

  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Мероприятие не найдено' });
    }

    await event.update({ title, descpription, createdby });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении мероприятия', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Мероприятие не найдено' });
    }

    await event.destroy();
    res.status(204).send(); // Успешное удаление, без содержимого
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении мероприятия', error: error.message });
  }
});

module.exports = router;

