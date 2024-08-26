import { ContactsCollection } from '../models/contacts.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  parentId,
}) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactsQuery = ContactsCollection.find();
  contactsQuery.where('parentId').equals(parentId);

  const [contacts, count] = await Promise.all([
    ContactsCollection.find()
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
    ContactsCollection.countDocuments(),
  ]);
  const totalPages = Math.ceil(count / perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems: count,
    totalPages,
    hasNextPage: totalPages - page > 0,
    hasPreviousPage: page > 1,
  };
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
