const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Убедитесь, что путь правильный
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

router.post("/register", async (req, res) => {
    const { email, name, password } = req.body; // Замените name на username
    if (!email || !name || !password) { 
        return res.status(400).json({ message: "Заполните все поля" });
    }
    try {
        const existingUser  = await User.findOne({ where: { email } });
        if (existingUser ) return res.status(400).json({ message: "Email уже используется" });
        
        const user = await User.create({ email, name, password }); // Исправьте name на username
        res.status(201).json({ message: "Регистрация успешна" });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Заполните все поля" });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Неверные учетные данные" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Неверные учетные данные" });
        }

        // Создание JWT
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET не установлен!");
            return res.status(500).json({ message: "Ошибка сервера: секретный ключ не установлен" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Успешный вход", token });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// Экспортируйте роутер
module.exports = router; // Используйте module.exports вместо export default
