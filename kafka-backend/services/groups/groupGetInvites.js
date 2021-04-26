const UserModel = require('../../models/UserSchema');
const GroupModel = require('../../models/GroupSchema');

const handle_request = async (req, callback) => {
    try {
        UserModel.findById(req.user.userId)
            .populate('invitedToGroups')
            .then((user) => {
                const invites = user.invitedToGroups;
                callback(null, {
                    invites,
                    success: true
                });
            });
    } catch (error) {
        callback(null, {
            errors: [error.message],
            success: false
        });
    }
};

exports.handle_request = handle_request;