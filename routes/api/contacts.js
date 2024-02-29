const express = require("express");

require("../../auth/strategy");
const auth = require("../../auth/auth");

const {
	addContact,
	getContactById,
	listContacts,
	removeContact,
	updateContact,
	updateStatusContact,
} = require("../../models/contacts");
const {
	newContactValidator,
	updateContactValidator,
} = require("../../validators/contactsValidator");

const router = express.Router();

router.get("/", auth, async (req, res, next) => {
	const ownerId = req.user._id;
	const contacts = await listContacts(ownerId);
	if (contacts) {
		return res.send({ contacts });
	}
	return res.status(404).send({
		message: "Not found",
	});
});

router.get("/:contactId", auth, async (req, res, next) => {
	const id = req.params.contactId;
	const ownerId = req.user._id;
	const contact = await getContactById(id, ownerId);
	if (contact) {
		res.send({
			contact,
		});
	} else {
		res.status(404).send({
			message: "Not found",
		});
	}
});

router.post("/", auth, async (req, res, next) => {
	const body = req.body;
	const { name, email, phone } = req.body;
	const ownerId = req.user._id;

	if (!name || !email || !phone) {
		return res.status(400).send({
			message: "missing required name - field",
		});
	}
	const isValid = newContactValidator.validate(body);
	if (isValid.error) {
		res.status(400).send({ message: isValid.error.message });
	} else {
		const contact = await addContact(body, ownerId);
		res.status(201).send({ contact });
	}
});

router.delete("/:contactId", auth, async (req, res, next) => {
	const id = req.params.contactId;
	const ownerId = req.user._id;
	const isDeleted = await removeContact(id, ownerId);
	console.log(isDeleted);
	if (isDeleted) {
		res.send({ message: "contact deleted" });
	} else {
		res.status(404).send({ message: "Not found" });
	}
});

router.put("/:contactId", auth, async (req, res, next) => {
	const id = req.params.contactId;
	const body = req.body;
	const ownerId = req.user._id;
	const { name, email, phone } = req.body;

	if (!name && !email && !phone) {
		return res.status(400).send({ message: "missing fields" });
	}

	const isValid = updateContactValidator.validate(body);

	if (isValid.error) {
		return res.status(400).send({ message: isValid.error.message });
	}

	const updatedContact = await updateContact(id, body, ownerId);

	if (!updatedContact) {
		res.status(404).send({ message: "Not found" });
	} else {
		res.send({ updatedContact });
	}
});

router.patch("/:contactId/favorite", auth, async (req, res, next) => {
	const id = req.params.contactId;
	const ownerId = req.user._id;
	const { favorite } = req.body;

	if (!favorite) {
		return res.status(400).send({ message: "missing field favorite" });
	}
	const updatedContact = await updateStatusContact(id, favorite, ownerId);

	if (!updatedContact) {
		return res.status(404).send({ message: "Not found" });
	}

	res.send({ updatedContact });
});

module.exports = router;
