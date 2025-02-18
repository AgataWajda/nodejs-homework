const passport = require("passport");
require("./strategy");

const auth = (req, res, next) => {
	passport.authenticate("jwt", { session: false }, (err, user) => {
		if (!user || err) {
			return res.status(401).send({
				message: "Not authorized",
			});
		}

		req.user = user;
		next();
	})(req, res, next);
};

module.exports = auth;
