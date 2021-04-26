
const UserModel = require('../../models/UserSchema');
const HistoryModel = require('../../models/HistorySchema');
const CommentModel = require('../../models/CommentSchema');

const handle_request = async (req, callback) => {
    try {
        await HistoryModel.findById(req.params.eId)
            .populate('comments')
            .populate({
                path: 'comments',
                populate: {
                    path: 'authorId',
                    model: 'UserModel'
                }
            })
            .then(doc => {
                callback(null, {
                    comments: doc.comments,
                    success: true
                });
            });
    }
    catch (error) {
        callback(null, {
            errors: [error.message],
            success: false
        });
    }
};

exports.handle_request = handle_request;