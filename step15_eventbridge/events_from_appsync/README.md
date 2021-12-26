# Events from AppSync

## Steps to code

1. Create new directory using `mkdir events_from_appsync`
2. Navigate to newly created directory using `cd events_from_appsync`
3. Create cdk v1 app using `npx aws-cdk@1.x init app --language typescript`
4. use `npm run watch` to auto transpile the code
5. Install AppSync in the stack using `npm i @aws-cdk/aws-appsync`. Update "./lib/events_from_appsync-stack.ts" to define a AppSync GQL Api

   ```js
   import * as appsync from '@aws-cdk/aws-appsync';
   const api = new appsync.GraphqlApi(this, 'Api', {
     name: 'appsyncEventbridgeAPI',
     schema: appsync.Schema.fromAsset('schema/schema.graphql'),
     authorizationConfig: {
       defaultAuthorization: {
         authorizationType: appsync.AuthorizationType.API_KEY,
         apiKeyConfig: {
           expires: cdk.Expiration.after(cdk.Duration.days(365)),
         },
       },
     },
     logConfig: { fieldLogLevel: appsync.FieldLogLevel.ALL },
     xrayEnabled: true,
   });
   ```

6. Create "./schema/schema.graphql" to define schema for api

   ```gql
   type Event {
     result: String
   }

   type Query {
     getEvent: [Event]
   }

   type Mutation {
     createEvent(event: String!): Event
   }
   ```

7. Install events in the stack using `npm i @aws-cdk/aws-events`. Update "./lib/events_from_appsync-stack.ts" to define a http datasource and grant acces to datasource for events

   ```js
   import * as events from '@aws-cdk/aws-events';
   const httpDs = api.addHttpDataSource(
     'ds',
     'https://events.' + this.region + '.amazonaws.com/', // This is the ENDPOINT for eventbridge.
     {
       name: 'httpDsWithEventBridge',
       description: 'From Appsync to Eventbridge',
       authorizationConfig: {
         signingRegion: this.region,
         signingServiceName: 'events',
       },
     }
   );
   events.EventBus.grantAllPutEvents(httpDs);
   ```

8. Update "./lib/events_from_appsync-stack.ts" to define resolver for data source

   ```js
   const putEventResolver = httpDs.createResolver({
     typeName: 'Mutation',
     fieldName: 'createEvent',
     requestMappingTemplate: appsync.MappingTemplate.fromFile('request.vtl'),
     responseMappingTemplate: appsync.MappingTemplate.fromFile('response.vtl'),
   });
   ```

9. Create "request.vtl" to define request mapping template

   ```vtl
   {
        "version": "2018-05-29",
        "method": "POST",
        "resourcePath": "/",
        "params": {
            "headers": {
                "content-type": "application/x-amz-json-1.1",
                "x-amz-target":"AWSEvents.PutEvents"
            },
            "body": {
                "Entries":[
                    {
                        "Source":"eru-appsync-events",
                        "EventBusName": "default",
                        "Detail":"{ \"event\": \"$ctx.arguments.event\"}",
                        "DetailType":"Event Bridge via GraphQL"
                    }
                ]
            }
        }
   }
   ```

10. Create "response.vtl" to define request mapping template

    ```vtl
    #if($ctx.error)
        $util.error($ctx.error.message, $ctx.error.type)
    #end
    #if($ctx.result.statusCode == 200)
        {
            "result": "$util.parseJson($ctx.result.body)"
        }
    #else
        $utils.appendError($ctx.result.body, $ctx.result.statusCode)
    #end
    ```

11. Install lambda function using `npm i @aws-cdk/aws-lambda`. Update "./lib/events_from_appsync-stack.ts" to define a reciver lambda function

    ```js
    import * as lambda from '@aws-cdk/aws-lambda';
    const echoLambda = new lambda.Function(this, 'echoFunction', {
      code: lambda.Code.fromInline(
        'exports.handler = (event, context) => { console.log(event); context.succeed(event); }'
      ),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
    });
    ```

12. Install targets using `npm i @aws-cdk/aws-events-targets`. Update "./lib/events_from_appsync-stack.ts" to define rule

    ```js
    const rule = new events.Rule(this, 'AppSyncEventBridgeRule', {
      eventPattern: {
        source: ['eru-appsync-events'],
      },
    });
    rule.addTarget(new targets.LambdaFunction(echoLambda));
    ```

13. Deploy using `npm run cdk deploy`
14. Destroy using `npm run cdk destroy`
