const jwt = require('jsonwebtoken');

exports.checkAuth = (req, res, next) => {
  console.log("Inside original auth");
  const authtkn = req.cookies.token;
  if (!authtkn) {
    return res.status(400).json({ msg: 'No auth token found. Please login again.' });
  }
  try {
    let decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
    req.user = decoded;
  } catch (error) {
    return res.status(400).json({ msg: 'Invalid auth token. Please login again.' });
  }
  next();
};
