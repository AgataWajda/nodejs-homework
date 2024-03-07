require("dotenv");

const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);

const { BASE_URL, DOMAIN, MAIL_SENDER, MAILGUN_API_KEY } = process.env;

const client = mailgun.client({
	username: "api",
	key: MAILGUN_API_KEY || "key-yourkeyhere",
});

const registerEmail = (email, verificationToken) => {
	client.messages.create(DOMAIN, {
		from: `<${MAIL_SENDER}>`,
		to: [email],
		subject: "Verify your email",
		html: `<b>Let's verify your email:</b><br><a href="${BASE_URL}/users/verify/${verificationToken}"> HERE <a/>`,
	});
};
module.exports = registerEmail;
