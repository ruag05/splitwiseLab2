var rpc = new (require("./kafkarpc"))();

//make request to kafka
function make_request(queue_name, msg_payload, callback) {
  console.log("make_request");
  console.log("queue_name: ", queue_name);
  rpc.makeRequest(queue_name, msg_payload, function (err, response) {
    if (err) console.error(err);
    else {
      console.log("Response is: ", response)
      callback(null, response);      
    }
  });
}
exports.make_request = make_request;