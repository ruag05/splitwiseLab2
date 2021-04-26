//user topics
const USER_LOGIN = "userLogin";
const USER_SIGNUP = "userSignup";
const USER_UPDATE_PROFILE = "userUpdateProfile";
const USER_UPDATE_PROFILE_PIC = "userUpdateProfilePic";
const USER_GET_PROFILE = "userGetProfile";
const USER_GET_EMAILS_EXCEPT_CURRENT = "userAllEmailsExceptCurrent";
const USER_GET_ALL_GROUPS = 'userGetAllGroups';
const USER_SETTLE = 'userSettle';
const USER_GET_HISTORY = 'userGetAllHistory';

//group topics
const GROUP_CREATE = "groupCreate";
const GROUP_INVITE_USER = "groupInviteUser";
const GROUP_ACCEPT_INVITE_USER = "groupAcceptInviteUser";
const GROUP_GET_INVITES = "groupGetInvites";
const GROUP_GET_BY_ID = "groupGetById";
const GROUP_LEAVE = "groupLeave";
const GROUP_ADD_EXPENSE = "groupAddExpense";
const GROUP_GET_TRANSACTION_BY_GROUPID = "groupGetTransactionByGroupId";
const GROUP_GET_DASHBOARD_DATA = "groupGetDashboardData";
const GROUP_GET_STATS = "groupGetStats";
const GROUP_GET_TUser = "groupGetTUser";
const GROUP_GET_ALL_GROUPS_NAME = "groupGetAllGroupsName";
const GROUP_POST_COMMENT = "groupPostComment";
const GROUP_GET_COMMENTS = "groupGetComments";
const GROUP_DELETE_COMMENT = "groupDeleteComment";
const GROUP_GET_COMMENT_AUTHOR = "groupGetCommentAuthor";

module.exports = {
  USER_LOGIN,
  USER_SIGNUP,
  USER_UPDATE_PROFILE,
  USER_UPDATE_PROFILE_PIC,
  USER_GET_PROFILE,
  USER_GET_EMAILS_EXCEPT_CURRENT,
  USER_GET_ALL_GROUPS,
  USER_SETTLE,
  USER_GET_HISTORY,

  GROUP_CREATE,
  GROUP_INVITE_USER,
  GROUP_ACCEPT_INVITE_USER,
  GROUP_GET_INVITES,
  GROUP_GET_BY_ID,
  GROUP_LEAVE,
  GROUP_ADD_EXPENSE,
  GROUP_GET_TRANSACTION_BY_GROUPID,
  GROUP_GET_DASHBOARD_DATA,
  GROUP_GET_STATS,
  GROUP_GET_TUser,
  GROUP_GET_ALL_GROUPS_NAME,
  GROUP_POST_COMMENT,
  GROUP_GET_COMMENTS,
  GROUP_DELETE_COMMENT,
  GROUP_GET_COMMENT_AUTHOR
};