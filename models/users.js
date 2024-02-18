const jsonwebtoken = require("jsonwebtoken");

const User = require("../schemata/usersSchema");

const SECRET = process.env.SECRET;

const registerUser = async (body) => {
	const { email, password } = body;
	const doesExist = await User.findOne({ email });

	if (doesExist) {
		return null;
	}
	const user = await User.create({ email, password });
	return user;
};

const loginUser = async (body) => {
	const { email, password } = body;
	const filter = { email, password };
	const user = await User.findOne(filter);

	if (!user) {
		return null;
	}

	const payload = {
		id: user.id,
	};
	const jwt = jsonwebtoken.sign(payload, SECRET);

	const updatedUser = await User.findOneAndUpdate(
		filter,
		{ token: jwt },
		{
			returnDocument: "after",
		}
	);
	return updatedUser;
};

module.exports = { loginUser, registerUser };
