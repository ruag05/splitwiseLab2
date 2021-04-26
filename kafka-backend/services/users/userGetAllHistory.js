const UserModel = require('../../models/UserSchema');
const HistoryModel = require('../../models/HistorySchema');

const handle_request = async (req, callback) => {
    try {
        const user = await UserModel.findById(req.user.userId);
        const groups = user.groups;
        const byGrps = await HistoryModel.find({ groupId: [...groups] });
        callback(null, {
            history: byGrps,
            gids: user.groups,
            success: true
        })
    } catch (error) {
        callback(null, {
            msg: error.message,
            success: false
          })
    }
};
exports.handle_request = handle_request;