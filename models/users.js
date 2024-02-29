const jwt = require("jsonwebtoken");

const User = require("../schemata/usersSchema");

const SECRET = process.env.SECRET;

const registerUser = async (body) => {
	try {
		const { email, password } = body;
		const doesExist = await User.findOne({ email });

		if (doesExist) {
			return null;
		}
		const user = new User({ email });
		user.setPassword(password);
		await user.save();
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

		if (user && user.validPassword(password)) {
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

module.exports = { loginUser, logout, registerUser };
