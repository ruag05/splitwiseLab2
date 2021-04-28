const CommentModel = require('../../models/CommentSchema');
const HistoryModel = require('../../models/HistorySchema');

const handle_request = async (req, callback) => {
    try {
        const newComment = new CommentModel({
            comment: req.body.comment,
            authorId: req.user.userId,
            expenseId: req.body.expId
        });
        const savedComment = await newComment.save()
        const currentExpense = await HistoryModel.findById(req.body.expId);
        await currentExpense.update({
            comments: [
                ...currentExpense.comments,
                savedComment._id
            ]
        })

        //add entry for the expense in the History Model
        await HistoryModel.create({
            authorId: req.user.userId,
            authorName: req.user.name,
            groupId: currentExpense.groupId,
            groupName: currentExpense.groupName,
            title: `${req.user.name} added comment "${req.body.comment}" for expense "${currentExpense.transName}"`,
            amount: 0
        })

        callback(null, {
            msg: "Comment Added Successfully",
            success: true
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