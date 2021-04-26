const path = require('path');
const multer = require('multer');
const { access, mkdirSync } = require('fs');
const { v4: uuid } = require('uuid');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userPath = path.join(process.cwd(), 'uploads');
    access(userPath, (err) => {
      if (err) {
        mkdirSync(userPath, { recursive: true });
        cb(null, userPath);
      } else {
        cb(null, userPath);
      }
    });
  },
  filename: function (req, file, cb) {
    cb(null, 'app-' + req.user.userId + '-' + uuid() + '-' + file.originalname);
  },
});

const multerOpts = {
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, //Max 5MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
};

const uploadMiddleware = (fields) => multer(multerOpts).fields(fields);

exports.uploadMiddleware = uploadMiddleware;
