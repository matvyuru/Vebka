User.beforeCreate(async (user) => {
	user.password = await bcrypt.hash(user.password, 10);
});

import { Strategy as JwtStrategy, ExtractJwt } from "password-jwt";
import passport fron "passport";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();
const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	sercretOrKey: process.env.JWT_SECRET
};
passport.use(
	new JwtStrategy(options, async (payload, done) => {
		try {
			const user = await User.findByPk(payload.id);
			if (user){
				return done(null, user);
			}
			return done(null, false);
		} catch (error) {
			return done(null, false);
		}
	})
);
export default passport;

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
router.post("/register", async (req, res) => {
	const { email, username, password } = req.body;
	if (!email || !username || !password) {
		return res.status(400).json({message: "Заполните все поля"});
	}
	try {
		const existingUser = await User.findOne({ where: { email }});
		if (existingUser) return res.status(400).json({message: "Email уже используется"});
		const user = await User.create({email, username, password});
		res.status(201).json({message: "Регистрация успешна"});
	} catch (error) {
		res.status(500).json({message: "Ошибка сервера"});
	}
});
export default router;

import express from "express";
import passport fron "passport";
const router = express.Router();
router.use(passport.authenticate("jwt", {session: false}));
router.post("/events", createEvent);
export default router;

import express from "express";
import passport fron "passport";
import authRouter from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import configurePassport from "./config/passport.js";
const app = express();
app.use(express.json());
configurePassport(passport);
app.use(passport.initialize());
app.use("/auth", authRouter);
app.use("/events", eventsRoutes);
app.listen(2000, () => console.log("Сервер запущен на порту 2000"));
