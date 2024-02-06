const express = require("express");

const {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact,
} = require("../../models/contacts");
const {
	newContactValidator,
	updateContactValidator,
} = require("../../validators/contactsValidator");

const router = express.Router();

router.get("/", async (req, res, next) => {
	const contacts = await listContacts();
	res.send({
		contacts,
	});
});

router.get("/:contactId", async (req, res, next) => {
	const id = req.params.contactId;
	const contact = await getContactById(id);
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

router.post("/", async (req, res, next) => {
	const body = req.body;
	const { name, email, phone } = req.body;

	const isValid = newContactValidator.validate(body);

	if (!name || !email || !phone) {
		res.status(400).send({
			message: "missing required name - field",
		});
	} else if (isValid.error) {
		res.status(400).send({ message: isValid.error.message });
	} else {
		const contact = await addContact(body);
		res.status(201).send({ contact });
	}
});

router.delete("/:contactId", async (req, res, next) => {
	const id = req.params.contactId;
	const isDeleted = await removeContact(id);

	if (isDeleted) {
		res.send({ message: "contact deleted" });
	} else {
		res.status(404).send({ message: "Not found" });
	}
});

router.put("/:contactId", async (req, res, next) => {
	const id = req.params.contactId;
	const body = req.body;
	const { name, email, phone } = req.body;

	if (!name && !email && !phone) {
		res.status(400).send({ message: "missing fields" });
	} else {
		const updatedContact = await updateContact(id, body);
		const isValid = updateContactValidator.validate(updatedContact);
		if (!updatedContact) {
			res.status(404).send({ message: "Not found" });
		} else if (isValid.error) {
			res.status(400).send({ message: isValid.error.message });
		} else {
			res.send({ updatedContact });
		}
	}
});

module.exports = router;
