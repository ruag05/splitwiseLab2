const TransactionModel = require('../../models/TransactionSchema');

const handle_request = async (req, callback) => {
    try {
        const authored = await TransactionModel.find({
            $and: [
                {
                    payerId: req.user.userId
                }, {
                    settled: false
                }
            ]
        })
        const borrowed = await TransactionModel.find({
            $and: [
                {
                    borrowerId: req.user.userId
                }, {
                    settled: false
                }
            ]
        })
        let totalPaid = 0;
        authored.map((tran) => {
            totalPaid += Math.abs(parseInt(tran.amount, 10));
        });
        let totalBorrowed = 0;
        borrowed.map((tran) => {
            totalBorrowed += Math.abs(parseInt(tran.amount, 10));
        });

        const getsBack = totalPaid - totalBorrowed;
        const owe = totalBorrowed - totalPaid;

        callback(null, {
            authored, borrowed, totalPaid, totalBorrowed,
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