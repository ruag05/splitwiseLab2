const express = require('express');
const {
  createGroup,
  inviteMember,
  acceptInvite,
  leaveGroup,
  allUserInvites,
  getById,
  addExpense,
  getTransByGId,
  getStats,
  getTuser,
  getAllGroupsName,
  getDashboardData,
  postComment,
  getComments,
  deleteComment,
  getCommentAuthor
} = require('../controllers/groups');

// const { checkAuth } = require('../utils/auth');
const { auth, checkAuth } = require( '../config/passport' );
auth();

const { uploadMiddleware } = require('../utils/upload');
const router = express.Router();

router.post(
  '/create',
  checkAuth,
  function (req, res, next) {
    try {
      uploadMiddleware([{ name: 'photo' }])(req, res, (err) => {
        if (err) {
          return res.status(400).json({ msg: err.message, errors: [] });
        }
        next();
      });
    } catch (error) {
      res.status(500).json({
        msg: 'Server Error',
        errors: ['Something went wrong while uploading documents. Please try again...'],
      });
    }
  },
  createGroup
);
router.post('/invite', checkAuth, inviteMember);
router.post('/leave', checkAuth, leaveGroup);
router.post('/acceptInvite', checkAuth, acceptInvite);
router.get('/getInvites', checkAuth, allUserInvites);
router.get('/getStats', checkAuth, getStats);
router.get('/getTransactions/:gid', checkAuth, getTransByGId);
router.post('/addExpense', checkAuth, addExpense);
router.get('/getTusers', checkAuth, getTuser);
router.get('/getAllGroupsName', checkAuth, getAllGroupsName);
router.get('/getDashboardData', checkAuth, getDashboardData);
router.post('/postComment', checkAuth, postComment);
router.get('/getComments/:eId', checkAuth, getComments);
router.post('/deleteComment', checkAuth, deleteComment);
router.post('/getCommentAuthor', checkAuth, getCommentAuthor);
router.get('/:id', checkAuth, getById);

module.exports = router;
