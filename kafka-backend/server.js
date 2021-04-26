const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { USER_LOGIN, USER_SIGNUP, USER_UPDATE_PROFILE, USER_UPDATE_PROFILE_PIC, USER_GET_PROFILE } = require('./kafka/topics')
const { USER_GET_EMAILS_EXCEPT_CURRENT, USER_GET_ALL_GROUPS, USER_SETTLE, USER_GET_HISTORY } = require('./kafka/topics');
const { GROUP_CREATE, GROUP_INVITE_USER, GROUP_ACCEPT_INVITE_USER, GROUP_GET_INVITES } = require('./kafka/topics');
const { GROUP_GET_BY_ID, GROUP_LEAVE, GROUP_ADD_EXPENSE, GROUP_GET_TRANSACTION_BY_GROUPID } = require('./kafka/topics');
const { GROUP_GET_DASHBOARD_DATA, GROUP_GET_STATS, GROUP_GET_TUser, GROUP_GET_ALL_GROUPS_NAME } = require('./kafka/topics');
const { GROUP_POST_COMMENT, GROUP_GET_COMMENTS, GROUP_DELETE_COMMENT, GROUP_GET_COMMENT_AUTHOR } = require('./kafka/topics');

dotenv.config();

// User
const userLogin = require('./services/users/userLogin');
const userSignup = require('./services/users/userSignup');
const userUpdateProfile = require('./services/users/userUpdateProfile');
const userUpdateProfilePic = require('./services/users/userUpdateProfilePic');
const userGetProfile = require('./services/users/userGetProfile');
const userAllEmailsExceptCurrent = require('./services/users/userAllEmailsExceptCurrent');
const userGetAllGroups = require('./services/users/userGetAllGroups');
const userSettle = require('./services/users/userSettle');
const userGetAllHistory = require('./services/users/userGetAllHistory');

// Group
const groupCreate = require('./services/groups/groupCreate');
const groupInviteUser = require('./services/groups/groupInviteUser');
const groupAcceptUserInvite = require('./services/groups/groupAcceptUserInvite');
const groupGetInvites = require('./services/groups/groupGetInvites');
const groupGetById = require('./services/groups/groupGetById');
const groupLeave = require('./services/groups/groupLeave');
const groupAddExpense = require('./services/groups/groupAddExpense');
const groupGetTransactionByGroupId = require('./services/groups/groupGetTransactionByGroupId');
const groupGetDashboardData = require('./services/groups/groupGetDashboardData');
const groupGetStats = require('./services/groups/groupGetStats');
const groupGetTUser = require('./services/groups/groupGetTUser');
const groupGetAllGroupsName = require('./services/groups/groupGetAllGroupsName');
const groupPostComment = require('./services/groups/groupPostComment');
const groupGetComments = require('./services/groups/groupGetComments');
const groupDeleteComment = require('./services/groups/groupDeleteComment');
const groupGetCommentAuthor = require('./services/groups/groupGetCommentAuthor');

const connection = require("./kafka/connection");

// connect to MongoDB
mongoose.connect(process.env.DATABASE_ACCESS, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("MongoDB connected");
})

function handleTopicRequest(topic_name, fname) {
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log("Server is running");
    consumer.on("message", function (message) {
        console.log("message received for topic: " + topic_name + " ", fname);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);

        fname.handle_request(data.data, function (err, res) {
            console.log("After handling, response is: ", res);
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res,
                    }),
                    partition: 0,
                },
            ];
            producer.send(payloads, function (err, data) {
                console.log("Data: ", data);
            });
            return;
        });
    });
}

// user handle requests
handleTopicRequest(USER_LOGIN, userLogin);
handleTopicRequest(USER_SIGNUP, userSignup);
handleTopicRequest(USER_UPDATE_PROFILE, userUpdateProfile);
handleTopicRequest(USER_UPDATE_PROFILE_PIC, userUpdateProfilePic);
handleTopicRequest(USER_GET_PROFILE, userGetProfile);
handleTopicRequest(USER_GET_EMAILS_EXCEPT_CURRENT, userAllEmailsExceptCurrent);
handleTopicRequest(USER_GET_ALL_GROUPS, userGetAllGroups);
handleTopicRequest(USER_SETTLE, userSettle);
handleTopicRequest(USER_GET_HISTORY, userGetAllHistory);

//group handle requests
handleTopicRequest(GROUP_CREATE, groupCreate);
handleTopicRequest(GROUP_INVITE_USER, groupInviteUser);
handleTopicRequest(GROUP_ACCEPT_INVITE_USER, groupAcceptUserInvite);
handleTopicRequest(GROUP_GET_INVITES, groupGetInvites);
handleTopicRequest(GROUP_GET_BY_ID, groupGetById);
handleTopicRequest(GROUP_LEAVE, groupLeave);
handleTopicRequest(GROUP_ADD_EXPENSE, groupAddExpense);
handleTopicRequest(GROUP_GET_TRANSACTION_BY_GROUPID, groupGetTransactionByGroupId);
handleTopicRequest(GROUP_GET_DASHBOARD_DATA, groupGetDashboardData);
handleTopicRequest(GROUP_GET_STATS, groupGetStats);
handleTopicRequest(GROUP_GET_TUser, groupGetTUser);
handleTopicRequest(GROUP_GET_ALL_GROUPS_NAME, groupGetAllGroupsName);
handleTopicRequest(GROUP_POST_COMMENT, groupPostComment);
handleTopicRequest(GROUP_GET_COMMENTS, groupGetComments);
handleTopicRequest(GROUP_DELETE_COMMENT, groupDeleteComment);
handleTopicRequest(GROUP_GET_COMMENT_AUTHOR, groupGetCommentAuthor);
