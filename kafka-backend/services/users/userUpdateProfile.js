const UserModel = require("../../models/UserSchema");

const handle_request = async (req, callback) => {
    try {
        const user = await UserModel.findById(req.user._id);
        console.log("inside handle_request........req: ", req)
        const modUser = await UserModel.findOneAndUpdate(
            { _id: user._id },
            {
                $set:
                {
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    photo: req.body.photo ? req.body.photo : "",
                    currency: req.body.currency,
                    timezone: req.body.timezone,
                    language: req.body.language
                },
            },
            { new: true }
        );

        callback(null, {
            user: {
                ...modUser.toObject(),
                password: ''
            },
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