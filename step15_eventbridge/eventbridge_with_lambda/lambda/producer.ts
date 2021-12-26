const AWS = require('aws-sdk');

function helper(body: any) {
  const eventBridge = new AWS.EventBridge({ region: 'eu-west-2' });

  return eventBridge
    .putEvents({
      Entries: [
        {
          EventBusName: 'default',
          Source: 'custom.api',
          DetailType: 'order',
          Detail: `{ "country": "${body.country}" }`,
        },
      ],
    })
    .promise();
}

exports.handler = async function (event: any) {
  console.log('EVENT BODY: \n', event.body);
  const e = await helper(JSON.parse(event.body));
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: `<h1>Event Published to Eventbridge</h1>${JSON.stringify(
      e,
      null,
      2
    )}`,
  };
};
