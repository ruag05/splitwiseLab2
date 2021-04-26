const DebtModel = require('../../models/DebtSchema');
const UserModel = require('../../models/UserSchema');

const handle_request = async (req, callback) => {
    try {
        const userSet = new Set();

        //get all debt entries in which either the current user is payer or borrower
        const rawUserDebts = await DebtModel.find({
            amount: { $ne: 0 },
            $or: [
                {
                    user1: req.user.userId
                }, {
                    user2: req.user.userId
                }
            ]
        });

        //get all users (including current user) involved in debt with current user
        await rawUserDebts.forEach(async (rawDebt, index) => {
            userSet.add(rawDebt.user1);
            userSet.add(rawDebt.user2);
        });

        //get all users (not including current user) involved in debt with current user
        userSet.forEach(user => {
            if (String(user) === String(req.user.userId)) {
                userSet.delete(user)
            }
        });

        //get all the objects of the user involved in debt with current user
        const userList = Array.from(userSet);
        const users = await UserModel.find({
            _id: userList
        }, {
            '_id': 1,
            'name': 1,
            'email': 1
        })

        //return only the id and name of the users involved in debt with current user
        const usersList = await users.map(user => {
            return {
                _id: user._id,
                name: user.name
            };
        });
        callback(null, {
            users: usersList,
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