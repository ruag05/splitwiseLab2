const CommentModel = require('../../models/CommentSchema');
const HistoryModel = require('../../models/HistorySchema');

const handle_request = async (req, callback) => {
    if (req.user !== null && req.body !== null) {
        try {
            await CommentModel.findById(req.body.commentId)
                .then(async (comment) => {
                    if (comment !== null) {
                        if (String(comment.authorId) === String(req.user._id)) {
                            const hist = await HistoryModel.findById(req.body.expId)
                            if (hist === null) {
                                callback(null, {
                                    msg: "Comment not found",
                                    success: false
                                });
                            }
                            else {                                
                                // remove comment from Expense model
                                await HistoryModel.findOneAndUpdate(
                                    { _id: req.body.expId },
                                    {
                                        $pull: {
                                            comments: req.body.commentId,
                                        },
                                    }
                                );

                                //remove comment from Comment model
                                await CommentModel.findOneAndDelete(
                                    { _id: req.body.commentId }
                                );

                                callback(null, {
                                    msg: "Comment Deleted",
                                    success: true
                                });
                            }
                        }
                        else {
                            callback(null, {
                                msg: "You can delete only your comments",
                                success: true
                            });
                        }
                    }
                })
        }
        catch (err) {
            callback(null, {
                errors: err,
                success: false
            });
        }
    }
};

exports.handle_request = handle_request;