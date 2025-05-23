const contectModel = require('../model/contectModel')


class ContactController {
    async createContact(data) {
        try {
            const { name, contact, email, subject, message } = data;

            if (!name || !contact || !email || !message) {
                return ({
                    msg: 'Please fill all required fields',
                    status: 0,
                });
            }

            const newContact = new contectModel({
                name,
                contact,
                email,
                subject,
                message,
            });

            await newContact.save();
            return ({
                msg: 'Contact form submitted successfully',
                status: 1,
            });
        } catch (error) {
            console.error('Contact creation error:', error);
            return ({
                msg: 'Internal server error',
                status: 0,
            });
        }
    }
}

module.exports = ContactController;
