// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const { body, validationResult } = require('express-validator');
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
// Создание нового пользователя
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Имя обязательно'),
    body('email').isEmail().withMessage('Неверный формат email').notEmpty().withMessage('Email обязателен'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email } = req.body;

    try {
      // Проверка уникальности email
      const existingUser  = await User.findOne({ where: { email } });
      if (existingUser ) {
        return res.status(400).json({ message: 'Email уже используется' });
      }

      const newUser  = await User.create({ name, email });
      res.status(201).json(newUser );
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка при создании пользователя' });
    }
  }
);

// Получение списка пользователей
router.get('/', async (req, res) => {
  // Получаем токен из заголовка авторизации
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
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении пользователей' });
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Получение списка пользователей
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешно получен список пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   email:
 *                     type: string
 *                     format: email
 *                   username:
 *                     type: string
 *       401:
 *         description: Токен не предоставлен или неверный токен
 *       500:
 *         description: Ошибка при получении пользователей
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

module.exports = router;
