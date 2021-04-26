"use strict";

const mongoose = require("mongoose");

const balanceSchema = new mongoose.Schema({
    memberId:
    {
        type: mongoose.Schema.Types.ObjectId
    },
    balance: Number
}, {
    timestamps: true
})

const GroupTemplate = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    photo: {
        type: String
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserModel'
        }
    ],
    invitedUserIds: [
        {
            type: mongoose.Schema.Types.ObjectId
        }
    ],
    balances: [balanceSchema]
});

module.exports = mongoose.model("GroupModel", GroupTemplate);