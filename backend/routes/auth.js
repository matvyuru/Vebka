const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const UserAdditionalInfo = require("../models/UserAdditionalInfo"); // Убедитесь, что путь правильный
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'Yandex', // Или другой почтовый сервис
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

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
    const currentIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // Получение IP-адреса
    const userAgent = req.headers['user-agent'];

    // Проверка наличия email и password
    if (!email || !password) {
        return res.status(400).json({ message: "Заполните все поля" });
    }

    try {
        // Поиск пользователя по email
        const user = await User.findOne({ where: { email }, include: UserAdditionalInfo });
        if (!user) {
            return res.status(400).json({ message: "Неверные учетные данные" }); // Не раскрываем, существует ли пользователь
        }

        // Сравнение пароля
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Неверные учетные данные" });
        }

        // Получение дополнительных данных
        const additionalInfo = user.UserAdditionalInfo || {};
        const lastIps = additionalInfo.lastIPs || [];
        const lastUserAgents = additionalInfo.lastUserAgents || [];

        // Проверка новых IP и User-Agent
        const isNewIp = !lastIps.includes(currentIp);
        const isNewUserAgent = !lastUserAgents.includes(userAgent);

        // Отправка уведомления, если IP или User-Agent новые
        if (isNewIp || isNewUserAgent) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Уведомление о входе в аккаунт',
                text: `Вы вошли в свою учетную запись с нового устройства или IP-адреса. Если это не вы, пожалуйста, измените свой пароль.`,
            };

            await transporter.sendMail(mailOptions);
        }

        // Обновление последних IP и User-Agent
        const updatedAdditionalInfo = additionalInfo || await UserAdditionalInfo.create({
            userId: user.id,
            lastIPs: [],
            lastUserAgents: [],
        });

        updatedAdditionalInfo.lastIPs = [...new Set([...lastIps, currentIp])].slice(-5); // Уникальные последние 5 IP
        updatedAdditionalInfo.lastUserAgents = [...new Set([...lastUserAgents, userAgent])].slice(-5); // Уникальные последние 5 User-Agent
        await updatedAdditionalInfo.save();

        // Создание JWT
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET не установлен!");
            return res.status(500).json({ message: "Ошибка сервера: секретный ключ не установлен" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Успешный вход", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});


// Экспортируйте роутер
module.exports = router; // Используйте module.exports вместо export default
