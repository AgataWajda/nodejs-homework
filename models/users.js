const jwt = require("jsonwebtoken");

const User = require("../schemata/usersSchema");

const SECRET = process.env.SECRET;

const registerUser = async (body) => {
	const { email, password } = body;
	const doesExist = await User.findOne({ email });

	if (doesExist) {
		return null;
	}
	const user = new User({ email });
	user.setPassword(password);
	await user.save();
	return user;
};

const loginUser = async (body) => {
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
			{
				returnDocument: "after",
			}
		);
		return updatedUser;
	}
	return null;
};

const logout = async (body) => {
	const { _id } = body;

	await User.findByIdAndUpdate(_id, { token: null });
};

module.exports = { loginUser, logout, registerUser };
