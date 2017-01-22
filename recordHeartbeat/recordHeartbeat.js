'use strict';

console.log('Loading function');

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event));
    
    var AWS = require("aws-sdk");
    var docClient = new AWS.DynamoDB.DocumentClient();
    
    var params = {
        TableName: "heartbeats",
        Item: {
            "user":  event.user,
            "id": event.id,
            "lastHeartbeat":  Date.now()
        }
    };
    
    docClient.put(params, function(err, data) {
       if (err) {
           var errorMsg = 'Unable to record heardbeat' + JSON.stringify(event);
           console.error(errorMsg);
           console.error(JSON.stringify(err))
           var errorResponse = {errorMsg: errorMsg}
           callback(errorResponse);
       } else {
           console.log("Succeeded:", JSON.stringify(event));
           var response = {result: "OK"}
           callback(null, response);
       }
    });
};

