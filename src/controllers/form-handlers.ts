import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { User } from "@models/User";
import passport from "passport";
import { Message } from "@models/Message";

const handleSignUp: any = [
	body("username").trim().isLength({ min: 6 }).escape(),
	body("password")
		.trim()
		.custom(value => {
			if (!/^.{8,}$/gi.test(value))
				throw new Error(
					"Passwords must be atleast 8 characters in length."
				);
			return true;
		}),
	async (req: Request, res: Response, next: NextFunction) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.render("sign-up", {
				title: "Members only! - Sign Up",
				error: "Passwords must be atleast 8 characters in length.",
			});

		try {
			const UserinDB = await User.find({ username: req.body.username });
			if (UserinDB.length > 0)
				return res.render("sign-up", {
					title: "Members only! - Sign Up",
					error: "User already exists.",
				});

			bcrypt.hash(req.body.password, 10, (e, hashedpw) => {
				if (e) return next(e);

				const user = new User({
					username: req.body.username,
					password: hashedpw,
					member: false,
					admin: false,
					avatar: req.body.avatar,
				}).save(err => (err ? next(err) : res.redirect("/log-in")));
			});
		} catch (e) {
			return next(e);
		}
	},
];

const handleLogIn = passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect: "/bad-credentials",
});

const handleMemberForm = [
	body("passcode")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Passcode mustn't be empty."),
	async (req: Request, res: Response, next: NextFunction) => {
		const errors = validationResult(req);

		if (!errors.isEmpty())
			return res.render("member", {
				title: "Members only! - Member Sign-up",
				error: "Passcode mustn't be empty.",
			});
		if (req.body.passcode !== process.env.MEMBER_CODE)
			return res.render("member", {
				title: "Members only! - Member Sign-up",
				error: "Incorrect Passcode provided.",
			});

		const readUser = new User(res.locals.currentUser);
		readUser.member = true;
		// TODO: Errors out while editing
		await User.findOneAndUpdate(
			{ username: readUser.username },
			readUser,
			{},
			err => {
				if (err) next(err);
				return res.redirect("/member");
			}
		);
	},
];

const handleMessageForm: any = [
	body("title")
		.trim()
		.isLength({ min: 1 })
		.withMessage("Title shouldn't be empty"),
	body("description")
		.trim()
		.isLength({ min: 1 })
		.withMessage("Description shouldn't be empty"),
	async (req: Request, res: Response, next: NextFunction) => {
		const errors = validationResult(req);

		if (!errors.isEmpty())
			return res.render("message", {
				title: "Members only! - New Message",
				error: "The title or description must not be empty.",
			});

		const message = new Message({
			user: res.locals.currentUser,
			title: req.body.title,
			description: req.body.description,
			time: new Date(),
		});

		await message.save(err => {
			if (err) return next(err);
			res.redirect("/");
		});
	},
];

export { handleSignUp, handleLogIn, handleMemberForm, handleMessageForm };
