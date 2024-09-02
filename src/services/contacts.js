import { ContactsCollection } from '../models/contacts.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  userId,
}) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactsQuery = ContactsCollection.find({ userId });
  contactsQuery
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(perPage);

  const [contacts, count] = await Promise.all([
    contactsQuery,
    ContactsCollection.countDocuments({ userId }),
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

export const getContactById = async (contactId, userId) => {
  const contact = await ContactsCollection.findOne({ _id: contactId, userId });

  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const updateContact = async (contactId, updateData, userId, photo) => {
  const updatedContact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    updateData,
    photo,
    {
      new: true,
      runValidators: true,
    },
  );
  return updatedContact;
};

export const deleteContact = async (contactsId, userId) => {
  const deletedContact = await ContactsCollection.findOneAndDelete({
    _id: contactsId,
    userId,
  });
  return deletedContact;
};
