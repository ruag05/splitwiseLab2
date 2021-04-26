const DebtModel = require('../../models/DebtSchema');
const UserModel = require('../../models/UserSchema');
const _ = require('lodash');

const userNamesDict = {};

async function getUserNameById(id) {
    if (id == null) {
      return '';
    } else if (userNamesDict[id] != null) {
      return userNamesDict[id];
    } else {
      const tempUser = await UserModel.findById(id);
      userNamesDict[id] = tempUser.name;
      return tempUser.name;
    }
  }

const handle_request = async (req, callback) => {
    const owesMe = {};
    const iOwe = {};

    //get all unsettled debts where the current user is User1 (lender)
    const debts1 = await DebtModel.find({
        user1: req.user.userId,
        amount: {
            $ne: 0
        }
    });

    //get list of users who owe the current user
    const debts1GroupedByUserId = _.chain(debts1)
        .groupBy((debt) => {
            return debt.user2;
        })
        .value();

    //compute debt for each user who owes current user
    for (let userId in debts1GroupedByUserId) {
        if (!owesMe[userId]) {
            owesMe[userId] = {};
            owesMe[userId].name = await getUserNameById(userId);
            owesMe[userId].amount = 0;
        }
        for (let index = 0; index < debts1GroupedByUserId[userId].length; index++) {
            owesMe[userId].amount = owesMe[userId].amount + debts1GroupedByUserId[userId][index].amount;
        }
    }

    //get all unsettled debts where the current user is User2 (borrower)
    const debts2 = await DebtModel.find({
        user2: req.user.userId,
        amount: {
            $ne: 0,
        }
    });

    //get list of users to whom current user owes
    const debts2GroupedByUserId = _.chain(debts2)
        .groupBy((debt) => {
            return debt.user1;
        })
        .value();

    //compute debt for each user to whom current user owes
    for (let userId in debts2GroupedByUserId) {
        if (!iOwe[userId]) {
            iOwe[userId] = {};
            iOwe[userId].name = await getUserNameById(userId);
            iOwe[userId].amount = 0;
        }
        for (let index = 0; index < debts2GroupedByUserId[userId].length; index++) {
            iOwe[userId].amount = iOwe[userId].amount - debts2GroupedByUserId[userId][index].amount;
        }
    }

    //compile entries of owe/borrow, to show in dashboard
    const finalDict = Object.assign(owesMe);
    for (const [key, value] of Object.entries(iOwe)) {
        if (!finalDict[key]) {
            finalDict[key] = value;
        } else {
            finalDict[key].amount += value.amount;
        }
    }

    const finalDashboardData = [];

    for (const [key, value] of Object.entries(finalDict)) {
        if (value.amount > 0) {
            finalDashboardData.push('You get back $' + parseFloat(value.amount).toFixed(2) + ' from ' + value.name);
        } else if (value.amount < 0) {
            finalDashboardData.push('You owe $' + parseFloat(value.amount).toFixed(2) + ' to ' + value.name);
        }
    }
    callback(null, {
        finalDashboardData,
        success: true
    });
};

exports.handle_request = handle_request;