const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const salt = bcrypt.genSaltSync(10);
const UserModel = require("../../models/UserSchema");
const secret = "CMPE_273_Splitwise_secret";

const handle_request = async (req, callback) => {
  await UserModel.findOne({ email: req.body.email }, (err, doc) => {
    if (doc === null) {
      callback(null, {
        msg: 'Account Not Found',
        success: false
      })
    }
    else {
      //check if password in DB matches the one entered
      if (bcrypt.compareSync(req.body.password, doc.password)) {
        let payload = {
          _id: doc._id,
          userId: doc._id, 
          email: doc.email,
          name: doc.name
        }
        let token = jwt.sign(payload, secret, {
          expiresIn: '4h'
        })
        callback(null, {
          token: 'Bearer '.concat(token),
          msg: 'Logged in successfully',
          userId: doc._id,
          role: 'User',
          success: true
        })
      } else {
        callback(null, {
          msg: 'Invalid Credentials Entered',
          success: false
        })
      }
    }
  });
}
exports.handle_request = handle_request;

