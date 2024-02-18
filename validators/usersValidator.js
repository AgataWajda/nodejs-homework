const joi = require("joi");

const userValidator = joi.object({
	email: joi
		.string()
		.email({
			minDomainSegments: 2,
		})
		.required(),

	password: joi.string().min(5).required(),
});

module.exports = { userValidator };
