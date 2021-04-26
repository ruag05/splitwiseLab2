const UserModel = require("../../models/UserSchema");
const GroupModel = require("../../models/GroupSchema");

const handle_request = async (req, callback) => {
    try {
        
        //check whether the user being invited is a valid user
        const userInvited = await UserModel.findOne({ email: req.body.email });
        if (!userInvited) {
            callback(null, {
                errors: ['User not found!'],
                success: false
            });
        }

        //check whether the group being invited to is a valid group
        const groupInvitedTo = await GroupModel.findOne({ name: req.body.name });
        if (!groupInvitedTo) {
            callback(null, {
                errors: ['Group not found!'],
                success: false
            });
        }

        //#region "Adding invitation to Group Model"

        //check if invitation is already sent to the user
        let isUserInvited = false;
        groupInvitedTo.invitedUserIds.forEach((userId) => {
            if (String(userId) === String(userInvited._id)) isUserInvited = true;
        });
        if (isUserInvited) {
            callback(null, {
                errors: ['User is already invited to the group!'],
                success: false
            });
        }

        //check if user is already member of the group  [Doubtful about its working]
        let isUserAMember = false;
        groupInvitedTo.members.forEach((member) => {
            if (String(member._id) === String(userInvited._id)) {
                isUserAMember = true;
            }
        });
        if (isUserAMember) {
            callback(null, {
                errors: ['User is already a member of the group!'],
                success: false
            });
        }

        //#endregion

        //#region "Adding invitation to User Model" [Might not be needed]

        //check if user already has invitation for the group
        let hasReceivedInvite = false;
        userInvited.invitedToGroups.forEach((groupId) => {
            if (String(groupId) === String(groupInvitedTo._id)) hasReceivedInvite = true;
        });
        if (hasReceivedInvite) {
            callback(null, {
                errors: ['The user is already invited to the group!'],
                success: false
            });
        }
        //check if user is already member of the group
        let isAlreadyMember = false;
        userInvited.groups.forEach((group) => {
            if (String(group._id) === String(groupInvitedTo._id)) {
                isAlreadyMember = true;
            }
        });
        if (isAlreadyMember) {
            callback(null, {
                errors: ['The user is already a member of the group!'],
                success: false
            });
        }
        //#endregion

        //add new invitation into group's invitedUsers field
        await GroupModel.findOneAndUpdate(
            { _id: groupInvitedTo._id },
            {
                $push: { invitedUserIds: userInvited._id },
            },
            { new: true }
        );

        //add new invitation into user's invitedGroups field
        await UserModel.findOneAndUpdate(
            { _id: userInvited._id },
            {
                $push: { invitedToGroups: groupInvitedTo._id },
            },
            { new: true }
        );
        callback(null, {
            msg: 'Invite Sent!',
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