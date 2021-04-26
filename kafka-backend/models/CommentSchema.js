const mongoose = require('mongoose');

const CommentTemplate = mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true
    },
    expenseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
},
    { timestamps: true });

module.exports = mongoose.model('CommentModel', CommentTemplate)