const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require('nodemailer');
const UserAdditionalInfo = require('../models/UserAdditionalInfo');
const dotenv = require("dotenv");
const nodemailerMock = require('nodemailer-mock');
const { registerUser, loginUser } = require('../routes/functionUs.js');
dotenv.config();
const router = express.Router();
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               name:
 *                 type: string
 *                 example: "myusername"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "mypassword"
 *     responses:
 *       201:
 *         description: Регистрация успешна
 *       400:
 *         description: Заполните все поля или Email уже используется
 *       500:
 *         description: Ошибка сервера
 */
router.post("/register", registerUser );
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Вход пользователя в систему
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Успешный вход
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Неверные учетные данные или заполнены не все поля
 *       500:
 *         description: Ошибка сервера
 */
router.post("/login", loginUser );


// Экспортируйте роутер
module.exports = router; // Используйте module.exports вместо export default