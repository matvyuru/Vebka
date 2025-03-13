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

module.exports = router;
