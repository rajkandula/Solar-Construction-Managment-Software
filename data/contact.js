const mongoCollections = require("../config/mongoCollections");
const contacts = mongoCollections.contact;

const addContact = async (name, email, message) => {
  if (!name || !email || !message) {
    throw new Error("Please provide all the necessary fields");
  }

  const contactCollection = await contacts();
  const newContact = {
    name,
    email,
    message,
  };

  const insertInfo = await contactCollection.insertOne(newContact);
  if (insertInfo.insertedCount === 0) {
    throw new Error("Failed to add contact");
  }

  const contactId = insertInfo.insertedId;
  return contactId;
};

module.exports = {
  addContact,
};
