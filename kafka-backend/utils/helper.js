const UserModel = require('../models/UserSchema');
const GroupModel = require('../models/GroupSchema');
const TransactionModel = require('../models/TransactionSchema');
const HistoryModel = require('../models/HistorySchema');

const userNamesDict = {}

async function getUserNameById(id) {
  if (id == null) {
    return "";
  } else if (userNamesDict[id] != null) {
    return userNamesDict[id]
  } else {
    const tempUser = await UserModel.findById(id);
    userNamesDict[id] = tempUser.name;
    return tempUser.name
  }
}

const groupNamesDict = {}

async function getGroupNameById(id) {
  if (id == null) {
    return "";
  } else if (groupNamesDict[id] != null) {
    return groupNamesDict[id]
  } else {
    const tempUser = await GroupModel.findById(id);
    groupNamesDict[id] = tempUser.name;
    return tempUser.name
  }
}

module.exports = {
  settleUpTheUsers: async (rawDebt) => {

    // find paidBy userId and paidTo userId
    const [toBepaidByUserId, toBepaidToUserId] =
      rawDebt.amount < 0
        ? [rawDebt.user1, rawDebt.user2]
        : [rawDebt.user2, rawDebt.user1];

    // find amount to be paid
    const amountToBePaid =
      rawDebt.amount < 0 ? -1 * rawDebt.amount : rawDebt.amount;

    const authorName = await getUserNameById(toBepaidByUserId);
    const otherName = await getUserNameById(toBepaidToUserId);
    const groupName = await getGroupNameById(rawDebt.group);

    // Add expense in history
    const expense = await HistoryModel.create({
      title: authorName + " settled balance with " + otherName,
      amount: amountToBePaid,
      groupId: rawDebt.group,
      authorId: toBepaidByUserId,
      authorName: authorName,
      groupName: groupName
    });

    // Update Group Balances
    const originalGrp = await GroupModel.findById(rawDebt.group);
    let paidByIndex = -1;
    for (i = 0; i < originalGrp.balances.length; i++) {
      if (String(originalGrp.balances[i].memberId) === String(toBepaidByUserId)) {
        paidByIndex = i;
        break;
      }
    }
    if (paidByIndex !== -1) {

      //update the balance for the existing borrower entry
      const balncToUpdate = originalGrp.balances[paidByIndex];
      balncToUpdate.balance = balncToUpdate.balance + amountToBePaid;

      originalGrp.balances[paidByIndex] = balncToUpdate;
      await originalGrp.save();
    }

    let paidToIndex = -1;
    for (i = 0; i < originalGrp.balances.length; i++) {
      if (String(originalGrp.balances[i].memberId) === String(toBepaidToUserId)) {
        paidToIndex = i;
        break;
      }
    }
    if (paidToIndex !== -1) {

      //update the balance for the existing borrower entry
      const balncToUpdate = originalGrp.balances[paidToIndex];
      balncToUpdate.balance = balncToUpdate.balance - amountToBePaid;

      originalGrp.balances[paidToIndex] = balncToUpdate;
      await originalGrp.save();
    }   

    // Create new activity for payer
    await TransactionModel.create(
      {
        payerId: toBepaidByUserId,
        borrowerId: toBepaidToUserId,
        groupId: rawDebt.group,
        title: "Settle balance",
        amount: amountToBePaid,
        // currency: "USD",
        settled: 1
      }
    );

    // Set debt amount to zero
    rawDebt.amount = 0;
    await rawDebt.save();
  },
}