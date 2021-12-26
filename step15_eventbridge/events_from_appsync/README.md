# Events from AppSync

## Steps to code

1. Create new directory using `mkdir events_from_appsync`
2. Navigate to newly created directory using `cd events_from_appsync`
3. Create cdk v1 app using `npx aws-cdk@1.x init app --language typescript`
4. use `npm run watch` to auto transpile the code
5. Install lambda in the stack using `npm i @aws-cdk/aws-lambda`. Update "./lib/events_from_appsync-stack.ts" to define a lambda function which will create an event.
