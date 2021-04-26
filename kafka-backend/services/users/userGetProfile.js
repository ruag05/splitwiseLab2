const UserModel = require("../../models/UserSchema");

const handle_request = async (req, callback) => {
    try {
        await UserModel.findById(req.user.userId)
            .then(data => {
                callback(null, {
                    ...data.toObject(),
                    password: "",
                    success: true
                })
            })
    } catch (error) {
        callback(null, {
            msg: error.message,
            success: false
        })
    }
};
exports.handle_request = handle_request;