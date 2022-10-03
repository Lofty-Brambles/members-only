import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { User } from "@models/User";
import passport from "passport";

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

const handleLogIn = () =>
	passport.authenticate("local", {
		failureRedirect: "/bad-credentials",
	});

export { handleSignUp, handleLogIn };
