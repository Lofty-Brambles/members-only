import { Schema, model } from "mongoose";

const UserSchema = new Schema({
	username: { type: String, required: true, maxLength: 25 },
	password: { type: String, required: true },
	member: { type: Boolean, default: false },
	admin: { type: Boolean, default: false },
	avatar: { type: String, required: true, default: "" },
});

export const User = model("User", UserSchema);
