import express, { NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import path from "path";

import createHttpError from "http-errors";
import logger from "morgan";
import compression from "compression";
import helmet from "helmet";

import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { compare } from "bcryptjs";

import { indexRouter } from "@routes/index";
import { HttpException, UserType } from "./types";
import { User } from "@models/User";

// init express
const app = express();

// database connection
config();
mongoose.connect(process.env.MONGO_URL!);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// adds passport middleware
passport.use(
	new LocalStrategy((username, password, done) => {
		User.findOne({ username }, (err: Error, user: UserType) => {
			if (err) return done(err);
			if (!user)
				return done(null, false, {
					message: "Incorrect Password entered.",
				});
			compare(password, user.password, (err, res) => {
				if (err) return done(err);
				if (res) return done(null, user);
				else
					return done(null, false, {
						message: "Incorrect Password entered.",
					});
			});
		});
	})
);

passport.serializeUser((user, done) => {
	interface extendedUserType extends Express.User {
		id: string;
	}

	const extendedUser = user as extendedUserType;
	done(user, extendedUser.id);
});
passport.deserializeUser((id: string, done) =>
	User.findById(id, (err: Error, user: UserType) => done(err, user))
);

// adds passport into express
app.use(
	session({
		secret: process.env.SECRET!,
		resave: false,
		saveUninitialized: false,
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

// adds user object access from anywhere
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

// sets basic express settings
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// view engine and statics primer
app.use(express.static(path.join(__dirname, "../", "public")));
app.set("views", path.join(__dirname, "../", "views"));
app.set("view engine", "pug");

// logger
if (app.get("env") === "development") {
	app.use(logger("dev"));
}

// security
if (app.get("env") === "production") {
	app.use(compression());
	app.use(helmet());
}

// adds base routing
app.use("/", indexRouter());

// catch 404 and fwd
app.use((req, res, next) => {
	next(createHttpError(404));
});
// error handler
app.use(
	(err: HttpException, req: Request, res: Response, next: NextFunction) => {
		res.locals.message = res.locals.error =
			req.app.get("env") === "development" ? err : {};

		// render error page
		res.status(err.status || 500);
		res.render("error");
	}
);

export { app };
