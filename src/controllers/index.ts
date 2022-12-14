import { Message } from "@models/Message";
import { NextFunction, Request, Response } from "express";

const index = async (req: Request, res: Response, next: NextFunction) => {
	Message.find()
		.sort({ time: "descending" })
		.populate("user")
		.exec((err, messages) => {
			if (err) next(err);
			res.render("index", { title: "Members only!", messages });
		});
};

const signUp = (req: Request, res: Response) => {
	res.render("sign-up", { title: "Members only! - Sign Up" });
};

const login = (req: Request, res: Response) => {
	res.render("log-in", { title: "Members only! - Log in" });
};

const logout = (req: Request, res: Response, next: NextFunction) => {
	req.logout(function (err) {
		if (err) next(err);
		res.redirect("/");
	});
};

const badCredentials = (req: Request, res: Response) => {
	res.render("bad-credentials", { title: "Members only! - Oh no" });
};

const memberPage = (req: Request, res: Response) => {
	// TODO: The get request reflects, but logs a header error
	if (!res.locals.currentUser) res.redirect("/log-in");
	res.render("member", {
		title: "Members only! - Member Sign-up",
	});
};

const adminPage = (req: Request, res: Response) => {
	// TODO: The get request reflects, but logs a header error
	if (!res.locals.currentUser) res.redirect("/log-in");
	res.render("admin", {
		title: "Members only! - Admin Sign-up",
	});
};

const messageForm = (req: Request, res: Response) => {
	// TODO: The get request reflects, but logs a header error
	if (!res.locals.currentUser) res.redirect("/log-in");
	res.render("message", { title: "Members only! - New Message" });
};

export {
	index,
	signUp,
	login,
	logout,
	badCredentials,
	memberPage,
	adminPage,
	messageForm,
};
