const { getCurrencySymbol } = require('../utils/currency');
const _ = require('lodash');
const GroupModel = require('../models/GroupSchema');
const UserModel = require('../models/UserSchema');
const TransactionModel = require('../models/TransactionSchema');
const DebtModel = require('../models/DebtSchema');
const HistoryModel = require('../models/HistorySchema');
const CommentModel = require('../models/CommentSchema');
var { auth, checkAuth } = require('../config/passport')
auth();

const { GROUP_CREATE, GROUP_INVITE_USER, GROUP_ACCEPT_INVITE_USER, GROUP_GET_INVITES, GROUP_DELETE_COMMENT } = require('../kafka/topics');
const { GROUP_GET_BY_ID, GROUP_LEAVE, GROUP_ADD_EXPENSE, GROUP_GET_TRANSACTION_BY_GROUPID } = require('../kafka/topics');
const { GROUP_GET_DASHBOARD_DATA, GROUP_GET_STATS, GROUP_GET_TUser, GROUP_GET_ALL_GROUPS_NAME } = require('../kafka/topics');
const { GROUP_POST_COMMENT, GROUP_GET_COMMENTS, GROUP_GET_COMMENT_AUTHOR } = require('../kafka/topics');

const mongoose = require('mongoose');

const kafka = require("../kafka/client");

exports.createGroup = async (req, res) => {
  const payload = { body: req.body, user: req.user };
  kafka.make_request(GROUP_CREATE, payload, (error, results) => {
    if (!results.success) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  });
};

exports.inviteMember = async (req, res) => {
  const payload = { body: req.body };
  kafka.make_request(GROUP_INVITE_USER, payload, (error, results) => {
    if (!results.success) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  });
};

exports.acceptInvite = async (req, res) => {
  const payload = { body: req.body, user: req.user };
  kafka.make_request(GROUP_ACCEPT_INVITE_USER, payload, (error, results) => {
    if (!results.success) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  });
};

exports.allUserInvites = async (req, res) => {
  const payload = { user: req.user };
  kafka.make_request(GROUP_GET_INVITES, payload, (error, results) => {
    if (!results.success) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  });
};

exports.getById = async (req, res) => {
  const payload = { params: req.params };
  kafka.make_request(GROUP_GET_BY_ID, payload, (error, results) => {
    if (!results.success) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  });
};

exports.leaveGroup = async (req, res) => {
  const payload = { user: req.user, body: req.body };
  kafka.make_request(GROUP_LEAVE, payload, (error, results) => {
    if (!results.success) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  });
};

exports.addExpense = async (req, res) => {
  const payload = { user: req.user, body: req.body };
  kafka.make_request(GROUP_ADD_EXPENSE, payload, (error, results) => {
    if (!results.success) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  });
};

exports.getTransByGId = async (req, res) => {
  const payload = { params: req.params };
  kafka.make_request(GROUP_GET_TRANSACTION_BY_GROUPID, payload, (error, results) => {
    if (!results.success) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  });
};

exports.getDashboardData = async (req, res) => {
  const payload = { user: req.user };
  kafka.make_request(GROUP_GET_DASHBOARD_DATA, payload, (error, results) => {
    if (!results.success) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  });
};

exports.getStats = async (req, res) => {
  const payload = { user: req.user };
  kafka.make_request(GROUP_GET_STATS, payload, (error, results) => {
    if (!results.success) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  });
};

exports.getTuser = async (req, res) => {
  const payload = { user: req.user };
  kafka.make_request(GROUP_GET_TUser, payload, (error, results) => {
    if (!results.success) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  });
};

exports.getAllGroupsName = async (req, res) => {
  const payload = {};
  kafka.make_request(GROUP_GET_ALL_GROUPS_NAME, payload, (error, results) => {
    if (!results.success) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  });
};

exports.postComment = async (req, res) => {
  const payload = { body: req.body, user: req.user };
  kafka.make_request(GROUP_POST_COMMENT, payload, (error, results) => {
    if (!results.success) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  });
};

exports.getComments = async (req, res) => {
  const payload = { params: req.params };
  kafka.make_request(GROUP_GET_COMMENTS, payload, (error, results) => {
    if (!results.success) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  });
};

exports.deleteComment = async (req, res) => {
  const payload = { body: req.body, user: req.user };
  kafka.make_request(GROUP_DELETE_COMMENT, payload, (error, results) => {
    if (!results.success) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  });
};

exports.getCommentAuthor = async (req, res) =>{
  const payload = { body: req.body, user: req.user };
  kafka.make_request(GROUP_GET_COMMENT_AUTHOR, payload, (error, results) => {
    if (!results.success) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  });
};
