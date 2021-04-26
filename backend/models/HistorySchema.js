"use strict";

const mongoose = require('mongoose');

const HistoryTemplate = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId
    },
    authorName: String,
    groupId: {
        type: mongoose.Schema.Types.ObjectId
    },
    groupName: String,
    transName: String,
    title: String,
    amount: Number,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CommentModel'
        }
    ]
},
    { timestamps: true });

module.exports = new mongoose.model('HistoryModel', HistoryTemplate);