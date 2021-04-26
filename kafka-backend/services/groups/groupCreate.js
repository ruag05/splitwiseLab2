
const GroupModel = require('../../models/GroupSchema');
const UserModel = require('../../models/UserSchema');

const handle_request = async (req, callback) => {
    try {
        let newGrp;

        //check if a group with same name exists
        await GroupModel.findOne({ name: req.body.name }).then(async (record) => {
            if (record) {
                callback(null, {
                    errors: ['Group name already taken'],
                    success: false
                });
            } else {

                //set photo
                req.body.photo = req.files?.photo[0]?.filename;

                //create group schema
                newGrp = new GroupModel({
                    name: req.body.name,
                    photo: req.body.photo,
                    author: req.user.userId,
                });

                //create group
                await newGrp.save().then(async (group) => {

                    //add author to the group just created
                    await GroupModel.findOneAndUpdate(
                        { _id: group._id },
                        {
                            $push: {
                                members: req.user.userId,
                            },
                        },
                        { new: true }
                    );

                    //add group into author's groups
                    await UserModel.findOneAndUpdate(
                        { _id: group.author },
                        {
                            $push: {
                                groups: group._id,
                            },
                        },
                        { new: true }
                    );
                    callback(null, {
                        msg: 'New group created',
                        group: group._id,
                        success: true
                    });
                });
            }
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