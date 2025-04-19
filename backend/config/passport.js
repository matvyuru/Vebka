const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User'); // Убедитесь, что путь правильный
require('dotenv').config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      const user = await User.findByPk(payload.id); // Проверяем существование пользователя по ID из токена
      if (user) {
        return done(null, user); // Если пользователь найден, передаем его в done
      }
      return done(null, false); // Если пользователь не найден, возвращаем false
    } catch (error) {
      console.error('Ошибка при проверке токена:', error);
      return done(error, false); // Возвращаем ошибку, если произошла ошибка
    }
  })
);

module.exports = passport;