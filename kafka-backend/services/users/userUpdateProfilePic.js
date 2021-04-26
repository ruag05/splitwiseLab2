const UserModel = require("../../models/UserSchema");

const handle_request = async (req, callback) => {
    try {
        await UserModel.updateOne({ _id: req.user.userId }, {
            $set: {
                photo: req.body.photo
            }
        },
            {
                upsert: true
            }, () => {
                callback(null, {
                    msg: 'Updated Profile picture',
                    photo: req.body.photo,
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

