// routes/events.js
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize'); // Добавьте этот импорт
const Event = require('../models/Event.js');
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');
const { deleteEvent, getEventById, createEvent, updateEvent } = require('../routes/functionEv.js');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Получить одно мероприятие по ID
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
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

router.get('/:id', getEventById);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Создать новое мероприятие
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
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
 *                 type: integer
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

router.post('/', createEvent);


/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Обновить мероприятие по ID
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
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
router.put('/:id', updateEvent);


/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Удалить мероприятие по ID
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
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
 *       403:
 *         description: У вас нет прав для удаления этого мероприятия
 *       500:
 *         description: Ошибка при удалении мероприятия
 */
router.delete('/:id', deleteEvent);

module.exports = router;