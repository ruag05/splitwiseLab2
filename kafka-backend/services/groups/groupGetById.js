const GroupModel = require('../../models/GroupSchema');

const handle_request = async (req, callback) => {
  try {
    const grp = await GroupModel.findById(req.params.id);
    callback(null, {
      group: grp,
      success: true
    });
  } catch (error) {
    callback(null, {
      errors: [error.message],
      success: false
    });
  }
};

exports.handle_request = handle_request;