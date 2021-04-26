
const HistoryModel = require('../../models/HistorySchema');
const CommentModel = require('../../models/CommentSchema');

const handle_request = async (req, callback) => {
    console.log("--------services groupGetCommentAuthor---------", req);
    // if (req.body.tId !== null && req.user !== null) {
    //     try {
    //         await HistoryModel.findById(req.body.tId)
    //             .then(hist => {
    //                 if (hist !== null) {
    //                     if (String(hist.authorId) === String(req.user._id)) {
    //                         console.log("Author verified, true")
    //                         callback(null, {
    //                             isAuthor: true,
    //                             success: true
    //                         });
    //                     }
    //                     else {
    //                         console.log("Author verified: false")

    //                         callback(null, {
    //                             isAuthor: false,
    //                             success: true
    //                         });
    //                     }
    //                 }
    //             })
    //     }
    //     catch (err) {
    //         callback(null, {
    //             errors: [err.message],
    //             success: false
    //         });
    //     }
    //}
};

exports.handle_request = handle_request;