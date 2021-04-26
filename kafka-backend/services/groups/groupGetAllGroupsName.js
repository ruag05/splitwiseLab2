const GroupModel = require('../../models/GroupSchema');

const handle_request = async (req, callback) => {
    try {
        const groups = await GroupModel.find();
        callback(null, {
            groups,
            success: true
        });
    } catch (error) {
        callback(null, {
            errors: [error.message],
            success: false
        });
    }
};
exports.handle_request = handle_request;