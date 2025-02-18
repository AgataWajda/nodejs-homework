const gravatar = require("gravatar");
const Jimp = require("jimp");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");

const registerEmail = require("./email");
const User = require("../schemata/usersSchema");

const SECRET = process.env.SECRET;

const registerUser = async (body) => {
	try {
		const { email, password } = body;

		const doesExist = await User.findOne({ email });
		if (doesExist) {
			return null;
		}

		const avatarURL = gravatar.url(email, {
			protocol: "http",
			s: "250",
			default: "default",
		});
		const verificationToken = nanoid();
		const user = new User({ email, avatarURL, verificationToken });
		user.setPassword(password);
		await user.save();
		await registerEmail(email, verificationToken);
		return user;
	} catch (error) {
		console.log(error.message);
	}
};

const loginUser = async (body) => {
	try {
		const { email, password } = body;
		const filter = { email };
		const user = await User.findOne(filter);

		if (user && user.validPassword(password) && user.verify) {
			const payload = {
				id: user.id,
			};

			const token = jwt.sign(payload, SECRET, { expiresIn: "1h" });

			const updatedUser = await User.findOneAndUpdate(
				filter,
				{ token },
				{ returnDocument: "after" }
			);
			return updatedUser;
		}

		return null;
	} catch (error) {
		console.log(error.message);
	}
};

const logout = async (body) => {
	try {
		const { _id } = body;

		await User.findByIdAndUpdate(_id, { token: null });
	} catch (error) {
		console.log(error.message);
	}
};

const updateAvatar = async (id, filePath) => {
	try {
		const resizedAvatar = await Jimp.read(filePath);
		await resizedAvatar.resize(250, 250).write(`public/avatars/${id}.jpg`);
		await User.findByIdAndUpdate(id, {
			avatarURL: `avatars/${id}.jpg`,
		});

		return `avatars/${id}.jpg`;
	} catch (error) {
		console.log(error.message);
	}
};

const sendMailAgain = async (email) => {
	try {
		const user = await User.findOne({ email });
		const { verify, verificationToken } = user;

		if (verify) {
			return verify;
		}
		await registerEmail(email, verificationToken);
		return verify;
	} catch (error) {
		console.log(error);
	}
};

const verify = async (verificationToken) => {
	try {
		const user = await User.findOne({ verificationToken });

		if (!user) {
			return null;
		}
		await User.findByIdAndUpdate(user._id, {
			verificationToken: null,
			verify: true,
		});

		return user;
	} catch (error) {
		console.log(error.message);
	}
};

module.exports = {
	loginUser,
	logout,
	registerUser,
	sendMailAgain,
	updateAvatar,
	verify,
};
