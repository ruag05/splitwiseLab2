const UserModel = require('../../models/UserSchema');

const handle_request = async (req, callback) => {
    try {

        //get all user email, except current user's email    
        await UserModel.find((err, docs) => {
            const emails = [];
            docs.forEach((doc) => {
                if (doc.id != req.user.userId)
                    emails.push(doc.email);
            });
            callback(null, {
                emails,
                success: true
            });
        });
    } catch (error) {
        callback(null, {
            msg: error.message,
            success: false
        })
    }
};
exports.handle_request = handle_request;