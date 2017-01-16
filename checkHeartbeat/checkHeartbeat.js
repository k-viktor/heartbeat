'use strict';

console.log('Loading function');

exports.handler = (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event));
   
  var AWS = require("aws-sdk");
 
  var docClient = new AWS.DynamoDB.DocumentClient();  
  var ses = new AWS.SES();   

  var readParams = {
    TableName: 'heartbeats',
    Key:{
        "user": event.user,
        "id": event.id
    }
  };

  var emailParams = { 
    Source: event.fromAddress, 
    Destination: { ToAddresses: [event.toAddress] },
    Message: {
      Subject: {
         Data: 'Heartbeat failed'
      },
      Body: {
        Text: {
          Data: 'Heartbeat Failed. Id: ' + event.id,
        }
      }
    }
  }

  docClient.get(readParams, function(err, data) {
    if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        callback("Failed when checking data");
    } else {
        console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
        var now = Date.now()
        // If last heartbeat was more than 5 minutes ago send email
        var msDiff = now - data.Item.lastHeartbeat
        console.log('Ms since last heartbeat: ' + msDiff)
        if(msDiff > 1000*60*5 ){
            ses.sendEmail(emailParams, function(err, data) {
              if(err) {
                console.error(JSON.stringify(err))
                callback('Sending email failed')
              } else {
                callback(null,'OK - Email sent')
              }
            });
        } else {
            callback(null, 'OK - no action')
        }
    }
  });
};


