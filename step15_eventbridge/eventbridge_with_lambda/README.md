# EventBridge with Lambda

## Steps to code

1. Create new directory using `mkdir eventbridge_with_lambda`
2. Navigate to newly created directory using `cd eventbridge_with_lambda`
3. Create cdk v1 app using `npx aws-cdk@1.x init app --language typescript`
4. use `npm run watch` to auto transpile the code
5. Install lambda in the stack using `npm i @aws-cdk/aws-lambda`. Update "./lib/eventbridge_with_lambda-stack.ts" to define a lambda function which will create an event.

   ```js
   import * as lambda from '@aws-cdk/aws-lambda';
   import * as path from 'path';
   const producerFn = new lambda.Function(this, 'producerLambda', {
     code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
     handler: 'producer.handler',
     runtime: lambda.Runtime.NODEJS_14_X,
   });
   ```

6. Install aws event in the stack using `npm i @aws-cdk/aws-events`. Update "./lib/eventbridge_with_lambda-stack.ts" to grant the lambda permission to put custom events on eventbridge.

   ```js
   import * as events from '@aws-cdk/aws-events';
   events.EventBus.grantAllPutEvents(producerFn);
   ```

7. Install apigatway in the stack using `npm i @aws-cdk/aws-apigateway`. Update "./lib/eventbridge_with_lambda-stack.ts" to define api gateway to be able to send custom events from frontend.

   ```js
   import * as apigateway from '@aws-cdk/aws-apigateway';
   const api = new apigateway.LambdaRestApi(this, 'testApi', {
     handler: producerFn,
   });
   ```

8. Update "./lib/eventbridge_with_lambda-stack.ts" to define api gateway to define a lambda function which our eventbridge rule will trigger when it matches the country as PK.

   ```js
   // The lambda function which our eventbridge rule will trigger when it matches the country as PK
   const consumerFn = new lambda.Function(this, 'consumerLambda', {
     runtime: lambda.Runtime.NODEJS_14_X,
     code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
     handler: 'consumer.handler',
   });
   ```

9. Install event target in the stack using `npm i @aws-cdk/aws-events-targets`. Update "./lib/eventbridge_with_lambda-stack.ts" to define the rule that filters events to match country == "PK" and sends them to the consumer Lambda.

   ```js
   import * as targets from '@aws-cdk/aws-events-targets';
   const PKrule = new events.Rule(this, 'orderPKLambda', {
     targets: [new targets.LambdaFunction(consumerFn)],
     description:
       'Filter events that come from country PK and invoke lambda with it.',
     eventPattern: {
       detail: {
         country: ['PK'],
       },
     },
   });
   ```

10. Create "./lambda/producer.ts" to create producer handler

    ```js
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
    ```

11. Create "./lambda/cosnumer.ts" to create producer handler

    ```js
    exports.handler = async function (event: any, context: any) {
      console.log('EVENT: \n' + JSON.stringify(event, null, 2));
      return context.logStreamName;
    };
    ```

12. Deploy the app using `npm run cdk deploy`

13. Destroy the app using `npm run cdk destroy`
