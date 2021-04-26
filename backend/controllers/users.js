const kafka = require("../kafka/client");
var { auth, checkAuth } = require( '../config/passport' )
auth();

const { USER_SIGNUP, USER_LOGIN, USER_UPDATE_PROFILE, USER_GET_PROFILE, USER_UPDATE_PROFILE_PIC } = require('../kafka/topics');
const { USER_GET_EMAILS_EXCEPT_CURRENT, USER_GET_ALL_GROUPS, USER_SETTLE, USER_GET_HISTORY } = require('../kafka/topics');

exports.register = async (req, res) => {
  const payload = { body: req.body };
  kafka.make_request(USER_SIGNUP, payload, (error, results) => {
    if (!results.success) {
      res.status(400).send(results);
    } else {

      res.cookie("auth", true, {
        path: '/',
        httpOnly: true,
        maxAge: 90000
      })
      res.cookie('token', results.token, {
        path: '/',
        maxAge: 90000,
        httpOnly: true,
      });
      res.status(200).json({
        token: results.token,
        msg: results.msg,
        userId: results.userId
      });
    }
  });
};

exports.login = async (req, res) => {
  const payload = { body: req.body };
  kafka.make_request(USER_LOGIN, payload, (error, results) => {
    if (!results.success) {
      res.status(400).send(results);
    } else {
      res.cookie("auth", true, {
        path: '/',
        httpOnly: true,
        maxAge: 90000
      })
      res.cookie("token", results.token.split(' ')[1], {
        path: '/',
        httpOnly: false,
        maxAge: 90000
      })
      res.status(200).send(results);
    }
  });
};

//not migrated yet
exports.autoLogin = (req, res) => {
  if (req.user) {
    res.json({ loggedIn: true, role: req.user.role });
  } else {
    res.json({ loggedIn: false, role: '' });
  }
};

exports.updateProfilePic = async (req, res) => {
  req.body.photo = req.files?.photo[0]?.filename;
  const payload = { body: req.body, user: req.user };
  kafka.make_request(USER_UPDATE_PROFILE_PIC, payload, (error, results) => {
    if (!results.success) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  });
};

exports.updateProfile = async (req, res) => {
  const payload = { body: req.body, user: req.user };
  kafka.make_request(USER_UPDATE_PROFILE, payload, (error, results) => {
    if (!results.success) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  });
};

exports.getById = async (req, res) => {
  const payload = { user: req.user };
  kafka.make_request(USER_GET_PROFILE, payload, (error, results) => {
    if (!results.success) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  });
};

exports.getAllEmailsExceptCurrent = async (req, res) => {
  const payload = { user: req.user };
  kafka.make_request(USER_GET_EMAILS_EXCEPT_CURRENT, payload, (error, results) => {
    if (!results.success) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  });
};

exports.getAllGroups = async (req, res) => {
  const payload = { user: req.user };
  kafka.make_request(USER_GET_ALL_GROUPS, payload, (error, results) => {
    if (!results.success) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  });
};

exports.settle = async (req, res) => {
  const payload = { user: req.user, body: req.body };
  kafka.make_request(USER_SETTLE, payload, (error, results) => {
    if (!results.success) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  });
};

exports.getAllHistory = async (req, res) => {
  const payload = { user: req.user };
  kafka.make_request(USER_GET_HISTORY, payload, (error, results) => {
    if (!results.success) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  });
};
