
const GroupModel = require('../../models/GroupSchema');
const UserModel = require('../../models/UserSchema');

const handle_request = async (req, callback) => {
    try {
        
        //check if invitation is valid
        const currentUser = await UserModel.findById(req.user.userId);

        let invitedToGroupId;
        currentUser.invitedToGroups.forEach((groupId) => {

            //try to replace foreach loop as we need to set invitedToGroup only once
            if (String(groupId) === String(req.body.inviteId)) {
                invitedToGroupId = groupId;
            }
        });
        if (!invitedToGroupId) {
            callback(null, {
                errors: ['Invitation not found'],
                success: false
            })
        }

        //check if 'group to accept' is a valid group
        const groupToAccept = await GroupModel.findById(invitedToGroupId);
        if (!groupToAccept) {
            callback(null, {
                errors: ['Group does not exist!'],
                success: false
            })
        }

        //check if user is already a member of the group - User Model
        let isGrpAccepted = false;
        for (let group of currentUser.groups) {
            if (String(group._id) === String(req.body.inviteId)) {
                isGrpAccepted = true;
                break;
            }
        }
        if (isGrpAccepted) {
            callback(null, {
                errors: ['Group is already accepted!'],
                success: false
            })
        }

        //check if user is already a member of the group - Group Model
        let isUserAMember = false;
        for (let memberId of groupToAccept.members) {
            if (String(memberId) === String(currentUser._id)) {
                isUserAMember = true;
                break;
            }
        }
        if (isUserAMember) {
            callback(null, {
                errors: ['User is already a member of the group!'],
                success: false
            })
        }
        await currentUser.update({ groups: [...currentUser.groups, groupToAccept._id] });
        await groupToAccept.update({ members: [...groupToAccept.members, currentUser._id] });

        //remove group from 'invitedToGroups' once accepted
        await UserModel.findOneAndUpdate(
            { _id: currentUser._id },
            {
                $pull: {
                    invitedToGroups: invitedToGroupId,
                },
            }
        );

        //remove user from 'invitedUsers' once the group is accepted
        await GroupModel.findOneAndUpdate(
            { _id: invitedToGroupId },
            {
                $pull: {
                    invitedUserIds: currentUser._id,
                },
            }
        );
        callback(null, {
            msg: 'Invitation Accepted',
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
            })
        } else {
            callback(null, {
                errors: [error.message],
                success: false
            })
        }
    }
};

exports.handle_request = handle_request;