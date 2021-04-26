"use strict";

const mongoose = require("mongoose");

const TransactionTemplate = new mongoose.Schema({
    payerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    borrowerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId
    },
    title: {
        type: String
    },
    amount: {
        type: Number
    },
    settled:{
        type: Boolean,
        default: false
    }
},
{ timestamps: true });

module.exports = mongoose.model("TransactionModel", TransactionTemplate);

