const express = require('express');
const {
  register,
  login,
  autoLogin,
  updateProfilePic,
  updateProfile,
  getById,
  getAllEmailsExceptCurrent,
  getAllGroups,
  settle,
  getAllHistory,
} = require('../controllers/users');

//const { checkAuth } = require('../utils/auth');
const { auth, checkAuth } = require( '../config/passport' )
auth();

const { uploadMiddleware } = require('../utils/upload');
const router = express.Router();

router.put('/register', register);
router.post('/register', register);
router.post('/login', login);
router.get('/autoLogin', checkAuth, autoLogin);
router.post(
  '/updateProfilePic',
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
  updateProfilePic
);
router.post('/update', checkAuth, updateProfile);
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.clearCookie('auth');
  res.json({ message: 'Logged Out' });
});
router.post('/settle', checkAuth, settle);
router.get('/', checkAuth, getById);
router.get('/getAllHistory', checkAuth, getAllHistory);
router.get('/getGroups', checkAuth, getAllGroups);
router.get('/getAllEmailsExceptCurrent', checkAuth, getAllEmailsExceptCurrent);

module.exports = router;
