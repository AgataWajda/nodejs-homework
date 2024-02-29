const Contacts = require("../schemata/contactSchema");

const listContacts = async (ownerId) => {
	try {
		const filter = { owner: ownerId };
		const contacts = await Contacts.find(filter);
		return contacts;
	} catch (error) {
		console.log(error.message);
	}
};

const getContactById = async (contactId, ownerId) => {
	try {
		const filter = { _id: contactId, owner: ownerId };
		const contact = await Contacts.findOne(filter);
		return contact;
	} catch (error) {
		console.log(error.message);
	}
};

const removeContact = async (contactId, ownerId) => {
	try {
		const filter = { _id: contactId, owner: ownerId };
		const deletedContact = await Contacts.deleteOne(filter);
		return deletedContact;
	} catch (error) {
		console.log(error.message);
	}
};

const addContact = async (body, ownerId) => {
	try {
		const contact = new Contacts({
			...body,
			owner: ownerId,
		});
		await contact.save();
		return contact;
	} catch (error) {
		console.log(error.message);
	}
};

const updateContact = async (contactId, body, ownerId) => {
	try {
		const filter = { _id: contactId, owner: ownerId };
		const contact = await Contacts.findOneAndUpdate(filter, body, {
			returnDocument: "after",
		});
		return contact;
	} catch (error) {
		console.log(error.message);
	}
};

const updateStatusContact = async (contactId, body, ownerId) => {
	try {
		const filter = { _id: contactId };
		const update = { favorite: body };

		const contact = await Contacts.findOneAndUpdate(filter, update, {
			returnDocument: "after",
		});

		return contact;
	} catch (error) {
		console.log(error.message);
	}
};

module.exports = {
	addContact,
	getContactById,
	listContacts,
	removeContact,
	updateContact,
	updateStatusContact,
};
