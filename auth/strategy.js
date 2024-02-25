const { Strategy: ExtractJwt, JwtStrategy } = require("passport-jwt");
const passport = require("passport");
const User = require("../schemata/usersSchema");

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.SECRET,
};
passport.use(
	new JwtStrategy(opts, async (payload, done) => {
		try {
			const user = await User.findOne({ _id: payload.id });

			if (!user) {
				return done(new Error("User not found"));
			}
			return done(null, user);
		} catch (error) {
			return done(error);
		}
	})
);
