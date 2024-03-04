const express = require("express");
const multer = require("multer");
const path = require("path");
const { unlink, writeFile } = require("fs/promises");

require("../../auth/strategy");
const auth = require("../../auth/auth");
const {
	logout,
	loginUser,
	registerUser,
	updateAvatar,
} = require("../../models/users");
const { userValidator } = require("../../validators/usersValidator");

const router = express.Router();
const upload = multer();

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

router.patch(
	"/avatars",
	auth,
	upload.single("avatar"),
	async (req, res, next) => {
		const userId = req.user._id;
		try {
			const originalFileName = req.file.originalname;
			const fileExt = path.extname(originalFileName);
			const filePath = path.join(process.cwd(), "tmp", `temporary${fileExt}`);
			await writeFile(filePath, req.file.buffer);
			const fileName = await updateAvatar(userId, filePath);
			await unlink(filePath);
			if (!fileName) {
				throw new Error("File saving error");
			}
			return res.send({
				avatarURL: fileName,
			});
		} catch (error) {
			console.log(error.message);
			res.send(500);
		}
	}
);

module.exports = router;
