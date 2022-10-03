import { NextFunction, Request, Response } from "express";

const index = (req: Request, res: Response) => {
	res.render("index", { title: "Members only!" });
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

const memberPage = (req: Request, res: Response, next: NextFunction) => {
	if (!res.locals.currentUser) res.redirect("/log-in");
	return res.render("member", {
		title: "Members only! - Member Sign-up",
		user: res.locals.currentUser,
	});
};

export { index, signUp, login, logout, badCredentials, memberPage };
