const GroupModel = require('../../models/GroupSchema');
const UserModel = require('../../models/UserSchema');
const HistoryModel = require('../../models/HistorySchema');
const TransactionModel = require('../../models/TransactionSchema');
const { getCurrencySymbol } = require('../../utils/currency');

const handle_request = async (req, callback) => {
    try {
        const group = await GroupModel.findById(req.params.gid);
        const membersOfGroup = group.members;
        const dictionary = {};
        const groupBalances = [];
        const owesMe = {};
        const iOwe = {};

        //save member names and their id, in key-value pair
        for (let index = 0; index < membersOfGroup.length; index++) {
            let tempUser = await UserModel.findById(membersOfGroup[index]);
            dictionary[membersOfGroup[index]] = tempUser.name;
        }

        //get current group
        const orgGrp = await GroupModel.findById(req.params.gid);

        //get indexes of all the non-zero balances from the current group
        let indexes = [];
        for (i = 0; i < orgGrp.balances.length; i++) {
            if (orgGrp.balances[i].balance !== 0) {
                indexes.push(i);
            }
        };

        //save all the non-zero balances of the current group along with who owe/get back...
        //...how much amount
        let newG = [];
        indexes.forEach(index => {
            newG.push(orgGrp.balances[index]);
        });

        await newG.forEach((gBalance) => {
            groupBalances.push(
                gBalance.balance > 0
                    ? dictionary[gBalance.memberId] + ' gets back $' + parseFloat(gBalance.balance).toFixed(2)
                    : dictionary[gBalance.memberId] + ' owes $' + parseFloat(-gBalance.balance).toFixed(2)
            );
        });

        //get all the unsettled transactions for the current group
        const g = await TransactionModel.find({
            groupId: req.params.gid,
            settled: false
        })
            .populate('payerId')
            .populate('borrowerId');

        let to = new Map();
        let tb = new Map();
        let users = new Map();

        //save how much the payer get backs in key-value pair
        g.map((t) => {
            if (to.has(t.payerId._id)) {
                to.set(t.payerId._id, +to.get(t.payerId._id) + +t.amount);
            } else {
                users.set(t.payerId._id, { name: t.payerId.name, crr: t.currency });
                to.set(t.payerId._id, +t.amount);
            }
        });

        //save how much the borrower owes in key-value pair
        g.map((t) => {
            if (tb.has(t.borrowerId._id)) {
                tb.set(t.borrowerId._id, (+tb.get(t.borrowerId._id) + +t.amount) * -1);
            } else {
                users.set(t.borrowerId._id, { name: t.borrowerId.name, crr: t.currency });
                tb.set(t.borrowerId._id, +t.amount * -1);
            }
        });

        let result = [];
        try {
            if (Array.from(to).length >= Array.from(tb).length) {
                to.forEach((val, key) => {
                    if (tb.has(key)) {
                        let sum = (+val + +tb.get(key)).toFixed(2);
                        if (sum > 0) {
                            result.push(
                                `${users.get(key).name} gets back ${getCurrencySymbol(users.get(key).crr)} ${sum}`
                            );
                        }
                        if (sum < 0) {
                            result.push(
                                `${users.get(key).name} pays ${getCurrencySymbol(users.get(key).crr)} ${Math.abs(
                                    sum
                                )}`
                            );
                        }
                    } else {
                        let sum = (+val).toFixed(2);
                        if (sum > 0) {
                            result.push(
                                `${users.get(key).name} gets back ${getCurrencySymbol(users.get(key).crr)} ${sum}`
                            );
                        }
                        if (sum < 0) {
                            result.push(
                                `${users.get(key).name} pays ${getCurrencySymbol(users.get(key).crr)} ${Math.abs(
                                    sum
                                )}`
                            );
                        }
                    }
                });
            } else {
                tb.forEach((val, key) => {
                    if (to.has(key)) {
                        let sum = (+to.get(key) + +val).toFixed(2);
                        if (sum > 0) {
                            result.push(
                                `${users.get(key).name} gets back ${getCurrencySymbol(users.get(key).crr)} ${sum}`
                            );
                        }
                        if (sum < 0) {
                            result.push(
                                `${users.get(key).name} pays ${getCurrencySymbol(users.get(key).crr)} ${Math.abs(
                                    sum
                                )}`
                            );
                        }
                    } else {
                        let sum = (+val).toFixed(2);
                        if (sum > 0) {
                            result.push(
                                `${users.get(key).name} gets back ${getCurrencySymbol(users.get(key).crr)} ${sum}`
                            );
                        }
                        if (sum < 0) {
                            result.push(
                                `${users.get(key).name} pays ${getCurrencySymbol(users.get(key).crr)} ${Math.abs(
                                    sum
                                )}`
                            );
                        }
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
        const h = await HistoryModel.find({ groupId: req.params.gid, amount: { $gt: 0 } });
        callback(null, {
            trans: g,
            history: h.reverse(),
            result,
            groupBalances,
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