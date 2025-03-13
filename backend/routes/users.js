// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const { body, validationResult } = require('express-validator'); // Импортируем express-validator

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
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при получении пользователей' });
  }
});

// Swagger документация для маршрутов пользователей
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Создать нового пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *     responses:
 *       201:
 *         description: Успешно создан пользователь
 *       400:
 *         description: Ошибка валидации или email уже используется
 *       500:
 *         description: Ошибка при создании пользователя
 *   get:
 *     summary: Получить список пользователей
 *     responses:
 *       200:
 *         description: Успешно получен список пользователей
 *       500:
 *         description: Ошибка при получении пользователей
 */

module.exports = router;
