const GroupModel = require('../../models/GroupSchema');
const UserModel = require('../../models/UserSchema');
const HistoryModel = require('../../models/HistorySchema');
const TransactionModel = require('../../models/TransactionSchema');
const DebtModel = require('../../models/DebtSchema');
const { getCurrencySymbol } = require('../../utils/currency');

const handle_request = async (req, callback) => {
  try {
    const user = await UserModel.findById(req.user.userId);
    const g = await GroupModel.findById(req.body.gid);
    let l = g.members.length < 1 ? 1 : g.members.length;

    const membersList = g.members;
    const totalMembersOfGroup = membersList.length;
    const partitionedAmount = req.body.amount / totalMembersOfGroup;

    //#region "Making/Updating expense entry(s) for Payer"
    //checking if payer has an existing balance for the group
    const payerAlreadyHaveBalance = g.balances.some(balance => {
      return balance.memberId.equals(req.user.userId);
    })
    if (payerAlreadyHaveBalance) {
      //entry already present for payer -> update balance in entry

      //get the current group
      const originalGrp = await GroupModel.findOne({ _id: req.body.gid }, { balances: 1 });

      //get the index of balance entry for the payer
      let payerIndex = -1;
      for (i = 0; i < originalGrp.balances.length; i++) {
        if (String(originalGrp.balances[i].memberId) === String(req.user.userId)) {
          payerIndex = i;
          break;
        }
      }

      //update the balance for the existing payer entry
      const balncToUpdate = originalGrp.balances[payerIndex];
      balncToUpdate.balance = balncToUpdate.balance + partitionedAmount * (totalMembersOfGroup - 1)

      //update the existing entry with the updated balance
      originalGrp.balances[payerIndex] = balncToUpdate;
      originalGrp.save();
    }
    else {

      //entry for payer not present -> create entry
      await GroupModel.findOneAndUpdate(
        {
          _id: req.body.gid,
        },
        {
          $push: {
            balances: {
              memberId: user._id,
              balance: partitionedAmount * (totalMembersOfGroup - 1),
            },
          },
        }
      );
    }
    //#endregion

    //#region "Making/Updating expense entry(s) for Borrower(s) "
    //adding expense object for the borrowers in the group
    membersList.forEach(async (userId) => {
      
      //ensure that the user is not payer
      if (userId != req.user.userId) {

        //check if borrower has an existing balance for the group
        const borrowerAlreadyHaveBalance = g.balances.some(balance => {
          return balance.memberId.equals(userId);
        })
        if (borrowerAlreadyHaveBalance) {
          //entry already present for borrower -> update balance in entry

          //get the current group
          const originalGrp = await GroupModel.findOne({ _id: req.body.gid }, { balances: 1 });

          //get the index of balance entry for the borrower
          let borrowerIndex = -1;
          for (i = 0; i < originalGrp.balances.length; i++) {
            if (String(originalGrp.balances[i].memberId) === String(userId)) {
              borrowerIndex = i;
              break;
            }
          }
          if (borrowerIndex !== -1) {

            //update the balance for the existing borrower entry
            const balncToUpdate = originalGrp.balances[borrowerIndex];
            balncToUpdate.balance = balncToUpdate.balance - 1 * partitionedAmount

            //update the existing entry with the updated balance
            originalGrp.balances[borrowerIndex] = balncToUpdate;
            originalGrp.save();
          }
        } else {

          //entry for borrower not present -> create entry
          await GroupModel.findOneAndUpdate(
            {
              _id: req.body.gid,
            },
            {
              $push: {
                balances: {
                  memberId: userId,
                  balance: -1 * partitionedAmount
                },
              },
            }
          );
        }
      }
    });
    //#endregion

    //#region "Making/Updating debt entry(s) for payer and borrower(s)"
    // Add data to the debts table
    await membersList.forEach(async (userId) => {
      const [userId1, userId2, amount] =
        req.user.userId < userId
          ? [req.user.userId, userId, partitionedAmount]
          : [userId, req.user.userId, -1 * partitionedAmount];

      if (String(userId1) !== String(userId2)) {

        //check if debt already exists for the member
        const debt = await DebtModel.findOne({
          user1: userId1,
          user2: userId2,
          group: req.body.gid,
        });

        //if exists -> update entry
        if (debt !== null) {
          debt.amount += amount;
          const updatedDebt = await debt.save();
        }

        //if not exist -> create new entry
        else {
          const newDebt = await DebtModel.create(
            [
              {
                user1: userId1,
                user2: userId2,
                group: req.body.gid,
                amount,
              },
            ]
          );
        }
      }
    });
    //#endregion

    //add entry for the expense for each member in the group
    g.members.map(async mem => {
      try {
        if (String(mem) != String(req.user.userId)) {
          const newTransaction = new TransactionModel({
            payerId: req.user.userId,
            borrowerId: mem,
            groupId: g._id,
            title: req.body.title,
            amount: (-1 * (req.body.amount / l)).toFixed(2)
          });
          await newTransaction.save()
        }
        else {
          const newTransaction = new TransactionModel({
            payerId: req.user.userId,
            borrowerId: mem,
            groupId: g._id,
            title: req.body.title,
            amount: (req.body.amount / l).toFixed(2)
          });
          await newTransaction.save()
        }
      } catch (error) {
        callback(null, {
          errors: [error.message],
          success: false
        });
      }
    });

    //console.log("inside services groupAddExpense...........user: ", user)
    //add entry for the expense in the History Model
    await HistoryModel.create({
      authorId: req.user.userId,
      authorName: user.name,
      groupId: req.body.gid,
      groupName: g.name,
      transName: req.body.title,
      title: `${user.name} added "${req.body.title}" of ${getCurrencySymbol(user.currency)}${req.body.amount}.`,
      amount: req.body.amount,
    })
    callback(null, {
      msg: 'Success',
      success: true
    });
  } catch (error) {
    callback(null, {
      errors: [error.message],
      success: false
    });
  }
};

exports.handle_request = handle_request;