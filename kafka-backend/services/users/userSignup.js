const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const salt = bcrypt.genSaltSync(10);
const Validator = require('fastest-validator');
const { v4: uuid } = require('uuid');
const UserModel = require("../../models/UserSchema");
const secret = "CMPE_273_Splitwise_secret";

const handle_request = async (req, callback) => {
    const registerSchema = {
        name: { type: 'string', nullable: false },
        email: { type: 'email', nullable: false },
        password: { type: 'string', min: 6, nullable: false },
        cpassword: { type: 'equal', field: 'password' },
    };

    const v = new Validator();
    const registerCheck = v.compile(registerSchema);

    //check if user inputs are proper 
    const errors = registerCheck(req.body);
    if (errors.length) {
        callback(null, {
            msg: 'Validation errors',
            errors,
            success: false
        })
    } else {
        try {
            //check if user already exists in DB
            await UserModel.findOne({ email: req.body.email }, (err, doc) => {
                if (doc !== null) {
                    callback(null, {
                        msg: 'Email already exists.',
                        success: false
                    })
                }
                else {

                    //encrpyt password for DB
                    req.body.password = bcrypt.hashSync(req.body.password, salt);
                    req.body.emailToken = uuid();

                    //create new user instance
                    const newUser = new UserModel({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                        currency: "USD"
                    });

                    //save user in DB
                    newUser.save()
                        .then(() => {
                            let payload = {
                                _id: newUser._id,
                                userId: newUser._id, 
                                email: newUser.email                               
                              }
                            let token = jwt.sign(payload, secret,
                                {
                                    expiresIn: '4h',
                                }
                            );
                            callback(null, {
                                token: 'Bearer '.concat(token),
                                msg: 'Registered successfully',
                                userId: newUser._id,
                                role: 'User',
                                success: true
                            })
                        })
                        .catch((err) => {
                            callback(null, {
                                msg: err.message,
                                success: false
                            })
                        });
                }
            });
        } catch (error) {
            callback(null, {
                msg: error.message,
                success: false
            })
        }
    }
}
exports.handle_request = handle_request;