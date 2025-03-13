// routes/events.js
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize'); // Добавьте этот импорт
const Event = require('../models/Event.js');

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Получить список всех мероприятий
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: false
 *         description: Дата начала для фильтрации мероприятий
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         required: false
 *         description: Дата окончания для фильтрации мероприятий
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Успешно получен список мероприятий
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Ошибка при получении мероприятий
 */
router.get('/', async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const whereClause = {};

    // Проверка и добавление фильтрации по дате
    if (startDate) {
      whereClause.date = { [Op.gte]: new Date(startDate) }; // Дата больше или равна startDate
    }
    if (endDate) {
      whereClause.date = { ...whereClause.date, [Op.lte]: new Date(endDate) }; // Дата меньше или равна endDate
    }

    const events = await Event.findAll({ where: whereClause });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении мероприятий', error: error.message });
  }
});

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Получить одно мероприятие по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID мероприятия
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Успешно получено мероприятие
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Ошибка при получении мероприятия
 */
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

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Создать новое мероприятие
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               descpription:
 *                 type: string
 *               createdby:
 *                 type: string
 *             required:
 *               - title
 *               - descpription
 *               - createdby
 *     responses:
 *       201:
 *         description: Успешно создано мероприятие
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Все поля обязательны
 *       500:
 *         description: Ошибка при создании мероприятия
 */
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

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Обновить мероприятие по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID мероприятия
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               descpription:
 *                 type: string
 *               createdby:
 *                 type: string
 *             required:
 *               - title
 *               - descpription
 *               - createdby
 *     responses:
 *       200:
 *         description: Успешно обновлено мероприятие
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Мероприятие не найдено
 *       400:
 *         description: Все поля обязательны
 *       500:
 *         description: Ошибка при обновлении мероприятия
 */
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

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Удалить мероприятие по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID мероприятия
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Успешное удаление мероприятия
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Ошибка при удалении мероприятия
 */
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

