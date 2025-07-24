const mongoose = require('mongoose');
const Notification = require('../../models/Notification');

function notificationSocket(io) {
    const changeStream = Notification.watch();

    changeStream.on('change', (change) => {
        let eventType;
        let updateData = {};

        switch (change.operationType) {
            case 'insert':
                eventType = 'create';
                updateData = change.fullDocument;
                console.log('notification created');

                break;
            case 'update':
                eventType = 'update';
                updateData = {
                    _id: change.documentKey._id,
                    updatedFields: change.updateDescription.updatedFields,
                };
                console.log('notification updated');
                break;
            case 'delete':
                eventType = 'delete';
                updateData = { _id: change.documentKey._id };
                console.log('notification deleted');

                break;
            default:
                console.log('Unhandled change type:', change.operationType);
                return;
        }

        io.emit('notification-update', { event: eventType, data: updateData });
    });

    changeStream.on('error', (err) => {
        console.error('ChangeStream error:', err);
    });
}

module.exports = notificationSocket;
