const UserModel = require('../../models/UserSchema');
const GroupModel = require('../../models/GroupSchema');

const handle_request = async (req, callback) => {
    try {
        await UserModel.findById(req.user.userId)
            .populate('groups')
            .then((data) => {
                callback(null, {
                    groups: data.groups,
                    success: true
                })
            });
    } catch (error) {
        callback(null, {
            msg: error.message,
            success: false
        })
    }
};
exports.handle_request = handle_request;