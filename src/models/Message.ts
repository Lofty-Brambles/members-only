import { Schema, model } from "mongoose";

const MessageSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	title: { type: String, required: true, minLength: 1, maxlength: 50 },
	description: { type: String, required: true, maxLength: 1000 },
	time: { type: Date, required: true, default: Date.now },
});

MessageSchema.virtual("displayTime").get(function () {
	const add0 = (t: number) => (t < 10 ? `0${t}` : String(t));
	const y: number = this.time.getFullYear();
	const m = add0(this.time.getMonth() + 1);
	const d = add0(this.time.getDate());
	const h = add0(this.time.getHours());
	const min = add0(this.time.getMinutes());
	return `${y}-${m}-${d} | ${h}:${min} hours`;
});

export const Message = model("Message", MessageSchema);
