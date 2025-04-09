const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
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

// Экспортируем роутер
module.exports = router; // Убедитесь, что вы экспортируете router
