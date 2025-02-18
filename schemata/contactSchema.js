const { model, Schema } = require("mongoose");

const contacts = new Schema({
	name: {
		type: String,
		required: [true, "Set name for contact"],
	},
	email: {
		type: String,
	},
	phone: {
		type: String,
	},
	favorite: {
		type: Boolean,
		enum: [true, false],
		default: false,
	},

	owner: {
		type: Schema.Types.ObjectId,
		ref: "user",
	},
});

const Contacts = model("contacts", contacts);

module.exports = Contacts;
