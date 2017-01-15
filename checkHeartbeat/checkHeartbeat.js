'use strict';

console.log('Loading function');

exports.handler = (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event));
   
  var AWS = require("aws-sdk");
  
  var ses = new AWS.SES();   

  var params = { 
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

  ses.sendEmail(params, function(err, data) {
    if(err) {
      console.error(JSON.stringify(err))
      callback('Sending email failed')
    } else {
      callback(null,'OK')
    }
 });
};

