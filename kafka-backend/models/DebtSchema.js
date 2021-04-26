const mongoose = require("mongoose");

const DebtTemplate = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GroupModel",
      required: true,
    },
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DebtModel", DebtTemplate);