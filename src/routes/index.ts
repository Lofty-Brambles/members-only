import express from "express";
import { index } from "@controllers/index";

const indexRouter = () => {
	const router = express.Router();

	router.get("/", index);

	return router;
};

export { indexRouter };
