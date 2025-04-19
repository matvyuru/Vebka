const User = require('../models/User.js');
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require('bcrypt');
const UserAdditionalInfo = require('../models/UserAdditionalInfo'); // Импортируйте модель дополнительной информации пользователя
const nodemailer = require('nodemailer'); // Импортируйте nodemailer

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Проверка на заполненность полей
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

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET не установлен!");
            return res.status(500).json({ message: "Ошибка сервера: секретный ключ не установлен" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        const ipAddress = req.headers['x-forwarded-for'] || req.ip;
        const userAgent = req.headers['user-agent'];

        let userInfo = await UserAdditionalInfo.findOne({ where: { userId: user.id } });
        if (!userInfo) {
            userInfo = await UserAdditionalInfo.create({
                userId: user.id,
                lastIPs: null,
                lastUserAgents: null
            });
        }
        const lastIPs = userInfo.lastIPs || [];
        const lastUserAgents = userInfo.lastUserAgents || [];
        // Проверяем, является ли это новым устройством
        const isNewDevice = !lastIPs.includes(ipAddress) || !lastUserAgents.includes(userAgent);
        
        if (isNewDevice) {
            // Добавляем новый IP-адрес и пользовательский агент
            if (!lastIPs.includes(ipAddress)) {
                lastIPs.push(ipAddress);
            }
            if (!lastUserAgents.includes(userAgent)) {
                lastUserAgents.push(userAgent);
            }

            // Обновляем userInfo с новыми значениями
            userInfo.lastIPs = lastIPs;
            userInfo.lastUserAgents = lastUserAgents;
            
            try {
    			await userInfo.save();
			} catch (error) {
    			console.error("Ошибка при сохранении данных:", error);
    			return res.status(500).json({ message: "Ошибка при сохранении данных" });
			}

            const transporter = nodemailer.createTransport({
                host: 'smtp.yandex.ru', // Хост Яндекс SMTP
                port: 465,               // Порт для SSL
                secure: true,
                service: 'Yandex',
                auth: {
                    user: 'c0untryhome@yandex.ru', // Ваша почта
                    pass: 'irpdkgrknvfgyzjg'           // Пароль от почты
                }
            });

            const mailOptions = {
                from: 'c0untryhome@yandex.ru',       // От кого
                to: email,         // Кому
                subject: 'Новое устройство',              // Тема
                text: 'Привет. Ты зашел в приложение на новом устройстве.'                 // Текст письма
            };  

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log('Ошибка при отправке:', error);
                }
            console.log('Письмо отправлено:', info.response);
            });
        }

        res.status(200).json({ message: "Успешный вход", token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Ошибка сервера" });
    }
};

const getAllUsers = async (req, res) => {
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
};

const registerUser  = async (req, res) => {
    const { email, name, password } = req.body; // Замените name на username
    if (!email || !name || !password) { 
        return res.status(400).json({ message: "Заполните все поля" });
    }

    try {
        const existingUser  = await User.findOne({ where: { email } });
        if (existingUser ) {
            return res.status(400).json({ message: "Email уже используется" });
        }
        
        const user = await User.create({ email, name, password }); // Исправлено name на username
        res.status(201).json({ message: "Регистрация успешна" });
    } catch (error) {
        console.error(error); // Логируем ошибку для отладки
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

module.exports = { getAllUsers, registerUser, loginUser }; 