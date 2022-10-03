import express from "express";
import {
	index,
	signUp,
	memberPage,
	login,
	badCredentials,
	logout,
} from "@controllers/index";
import { handleLogIn, handleSignUp } from "@controllers/form-handlers";

const indexRouter = () => {
	const router = express.Router();

	router.get("/", index);

	router.get("/sign-up", signUp);
	router.post("/sign-up", handleSignUp);

	router.get("/log-in", login);
	router.post("/log-in", handleLogIn());
	router.get("/log-out", logout);
	router.get("/bad-credentials", badCredentials);

	router.get("/member", memberPage);

	return router;
};

export { indexRouter };
