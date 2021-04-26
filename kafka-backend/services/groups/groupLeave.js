const GroupModel = require('../../models/GroupSchema');
const UserModel = require('../../models/UserSchema');
const DebtModel = require('../../models/DebtSchema');

const handle_request = async (req, callback) => {
    try {
        const user = await UserModel.findById(req.user.userId);
        if (!user) {
            callback(null, {
                errors: ['User not found!'],
                success: false
            });
        }
        const group = await GroupModel.findById(req.body.groupId);
        if (!group) {
            callback(null, {
                errors: ['Group not found!'],
                success: false
            });
        }

        const newTs = await DebtModel.find({
            user1: req.user.userId,
            group: req.body.groupId,
            amount: { $ne: 0 }
        });

        const newTs2 = await DebtModel.find({
            user2: req.user.userId,
            group: req.body.groupId,
            amount: { $ne: 0 }
        });

        if (newTs.length > 0 || newTs2.length > 0) {
            callback(null, {
                errors: [
                    'You have some unsettled transactions to be settle. Please do that before leaving the group',
                ],
                success: false
            });
        }

        await group.update({ members: [...group.members.filter((_id) => String(_id) != String(user._id))] });
        await user.update({ groups: [...user.groups.filter((id) => String(id) != String(group._id))] });
        callback(null, {
            msg: 'Group left',
            success: true
        });
    } catch (error) {
        let errors = [];
        if (error.error) {
            error.errors.map((e) => {
                errors.push(e.message);
            });
            callback(null, {
                errors,
                success: false
            });
        } else {
            callback(null, {
                errors: [error.message],
                success: false
            });
        }
    }
};

exports.handle_request = handle_request;