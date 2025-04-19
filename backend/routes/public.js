const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Event = require('../models/Event.js');
/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Уникальный идентификатор мероприятия
 *         title:
 *           type: string
 *           description: Название мероприятия
 *         date:
 *           type: string
 *           format: date
 *           description: Дата проведения мероприятия
 *         descpription:
 *           type: string
 *           description: Описание мероприятия
 *         createdby:
 *           type: integer
 *           description: ID пользователя, создавшего мероприятие
 */
/**
 * @swagger
 * /eventspublic:
 *   get:
 *     summary: Получить список всех мероприятий
 *     tags: [Events]
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
 *             examples:
 *               example-1:
 *                 value: [
 *                   {"id":2,"title":"Look","date":"2025-03-13","descpription":"\"Ulet\"","createdby":1}
 *                 ]
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

// Экспортируем роутер
module.exports = router; // Убедитесь, что вы экспортируете router