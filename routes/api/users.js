const express = require("express");

require("../../auth/strategy");
const auth = require("../../auth/auth");
const { logout, loginUser, registerUser } = require("../../models/users");
const { userValidator } = require("../../validators/usersValidator");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
	const body = req.body;
	const isValid = userValidator.validate(body);

	if (isValid.error) {
		return res.status(400).send({ message: isValid.error.message });
	}
	const user = await registerUser(body);

	if (!user) {
		return res.status(409).send({ message: "Email in use" });
	}
	res.status(201).send({ email: user.email, password: user.password });
});

router.post("/login", async (req, res, next) => {
	const body = req.body;
	const isValid = userValidator.validate(body);

	if (isValid.error) {
		return res.status(400).send({ message: isValid.error.message });
	}

	const user = await loginUser(body);

	if (!user) {
		return res.status(401).send({ message: "Email or password is wrong" });
	}

	res.send({
		token: user.token,
		user: {
			email: user.email,
			subscription: user.subscription,
		},
	});
});

router.get("/logout", auth, async (req, res, next) => {
	const user = req.user;
	await logout(user);
	res.status(204).send();
});

router.get("/current", auth, async (req, res, next) => {
	const user = req.user;
	const { email, subscription } = user;
	res.send({ email, subscription });
});

module.exports = router;
