import express from "express";
import {
	index,
	signUp,
	memberPage,
	login,
	badCredentials,
	logout,
	messageForm,
	adminPage,
} from "@controllers/index";
import {
	handleAdminForm,
	handleIndex,
	handleLogIn,
	handleMemberForm,
	handleMessageForm,
	handleSignUp,
} from "@controllers/form-handlers";

const indexRouter = () => {
	const router = express.Router();

	router.get("/", index);
	router.post("/", handleIndex);

	router.get("/sign-up", signUp);
	router.post("/sign-up", handleSignUp);

	router.get("/log-in", login);
	router.post("/log-in", handleLogIn);
	router.get("/log-out", logout);
	router.get("/bad-credentials", badCredentials);

	router.get("/member", memberPage);
	router.post("/member", handleMemberForm);

	router.get("/admin", adminPage);
	router.post("/admin", handleAdminForm);

	router.get("/message", messageForm);
	router.post("/message", handleMessageForm);

	return router;
};

export { indexRouter };
