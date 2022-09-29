import { Request, Response } from "express";

const index = (req: Request, res: Response) => {
	res.render("index", { title: "Party Bag!" });
};

export { index };
