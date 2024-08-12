import { ContactsCollection } from '../models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contacts = await ContactsCollection.findById(contactId);

  return contacts;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);

  return contact;
};

export const updateContact = async (contactId, updateData) => {
  const updatedContact = await ContactsCollection.findByIdAndUpdate(
    contactId,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );
  return updatedContact;
};

export const deleteContact = async (contactId) => {
  const deletedContact = await ContactsCollection.findByIdAndDelete(contactId);
  return deletedContact;
};
