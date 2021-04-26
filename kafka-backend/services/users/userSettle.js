const DebtModel = require('../../models/DebtSchema');
const utils = require('../../utils/helper');

const handle_request = async (req, callback) => {
    try {
        // userId1 is the smaller userId
        // userId2 is the larger userId
        const [userId1, userId2] =
            req.user.userId < req.body.borrowerId
                ? [req.user.userId, req.body.borrowerId]
                : [req.body.borrowerId, req.user.userId];
        const rawUserDebts = await DebtModel.find({
            user1: userId1,
            user2: userId2,
            amount: {
                $ne: 0,
            },
        });
        await rawUserDebts.forEach(async (rawDebt, index) => {
            await utils.settleUpTheUsers(rawDebt);
            if (index == rawUserDebts.length - 1) {
                callback(null, {
                    message: "Successfully settled up",
                    success: true
                })
                return;
            }
        });
    } catch (error) {
        callback(null, {
            msg: error.message,
            success: false
        })
    }
};
exports.handle_request = handle_request;
